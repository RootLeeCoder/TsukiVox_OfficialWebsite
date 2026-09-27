"""Render the supplied TsukiVox Unity scene, using its meshes, transforms and colors.
Requires numpy, scipy, pyyaml, pillow, moderngl. This is a web rendering, not a Quest capture.
"""
import argparse, re
from pathlib import Path
import numpy as np
import yaml
from scipy.spatial.transform import Rotation
from PIL import Image
import moderngl

parser = argparse.ArgumentParser()
parser.add_argument('scene', type=Path)
parser.add_argument('wordmark', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
source = args.scene.read_text()
source = re.sub(r'(m_IndexBuffer: | _typelessdata: )([0-9a-fA-F]+)', r'\1"\2"', source)
objects = {}
for match in re.finditer(r'--- !u!(\d+) &(\d+)\n(.*?)(?=\n--- !u!|\Z)', source, re.S):
    if int(match[1]) in [1, 4, 21, 23, 33, 43, 224]:
        objects[int(match[2])] = (int(match[1]), next(iter(yaml.load(match[3], Loader=yaml.CSafeLoader).values())))
transforms = {v['m_GameObject']['fileID']: key for key, (kind, v) in objects.items() if kind in [4, 224]}
filters = {v['m_GameObject']['fileID']: v for kind, v in objects.values() if kind == 33}

def vec(d, keys='xyz'):
    return np.array([d[k] for k in keys], dtype='f4')

world_cache = {}
def world(key):
    if not key: return np.eye(4)
    if key in world_cache: return world_cache[key]
    t = objects[key][1]
    m = np.eye(4)
    m[:3,:3] = Rotation.from_quat(vec(t['m_LocalRotation'], 'xyzw')).as_matrix() @ np.diag(vec(t['m_LocalScale']))
    m[:3,3] = vec(t['m_LocalPosition'])
    m = world(t['m_Father']['fileID']) @ m
    world_cache[key] = m
    return m

def active(key):
    if not key: return True
    t = objects[key][1]
    return bool(objects[t['m_GameObject']['fileID']][1]['m_IsActive']) and active(t['m_Father']['fileID'])

def primitive(kind):
    p, n, uv, ids = [], [], [], []
    def quad(points, normals, uvs=None):
        start = len(p)
        p.extend(points); n.extend(normals); uv.extend(uvs or [[0,0],[1,0],[1,1],[0,1]])
        ids.extend([start,start+1,start+2,start,start+2,start+3])
    if kind in [10202, 10210]:
        for axis in range(3):
            for sign in [-1,1]:
                points=[]; normal=[0,0,0]; normal[axis]=sign
                for a,b in [(-.5,-.5),(.5,-.5),(.5,.5),(-.5,.5)]:
                    pt=[0,0,0];pt[axis]=sign*.5;pt[(axis+1)%3]=a;pt[(axis+2)%3]=b;points.append(pt)
                quad(points,[normal]*4)
    elif kind == 10206:
        for i in range(40):
            a,b=np.array([i,i+1])*2*np.pi/40
            na,nb=[np.cos(a),0,np.sin(a)],[np.cos(b),0,np.sin(b)]
            quad([[na[0]*.5,-1,na[2]*.5],[nb[0]*.5,-1,nb[2]*.5],[nb[0]*.5,1,nb[2]*.5],[na[0]*.5,1,na[2]*.5]],[na,nb,nb,na])
            for sign in [-1,1]: quad([[0,sign,0],[na[0]*.5,sign,na[2]*.5],[nb[0]*.5,sign,nb[2]*.5],[0,sign,0]],[[0,sign,0]]*4)
    elif kind == 10207:
        for i in range(24):
            for j in range(16):
                normals=[]
                for x,y in [(i,j),(i+1,j),(i+1,j+1),(i,j+1)]:
                    a=x*2*np.pi/24;b=y*np.pi/16
                    normals.append([np.cos(a)*np.sin(b),np.cos(b),np.sin(a)*np.sin(b)])
                quad((np.array(normals)*.5).tolist(),normals)
    elif kind == 10209:
        quad([[-.5,-.5,0],[.5,-.5,0],[.5,.5,0],[-.5,.5,0]],[[0,0,-1]]*4)
    return np.array(p),np.array(n),np.array(uv),np.array(ids,dtype='i4')

mesh_cache = {}
def mesh(key):
    if key in mesh_cache: return mesh_cache[key]
    if key not in objects: result=primitive(key)
    else:
        d=objects[key][1]; v=d['m_VertexData']; data=bytes.fromhex(v['_typelessdata']); channels=v['m_Channels']; count=v['m_VertexCount']
        stride=max(c['offset']+c['dimension']*4 for c in channels if c['stream']==0 and c['dimension'])
        def channel(i, dim):
            c=channels[i]
            if not c['dimension']: return np.zeros((count,dim))
            return np.ndarray((count,c['dimension']),dtype='<f4',buffer=data,offset=c['offset'],strides=(stride,4)).copy()
        result=(channel(0,3),channel(1,3),channel(4,2),np.frombuffer(bytes.fromhex(d['m_IndexBuffer']),dtype='<u2' if d['m_IndexFormat']==0 else '<u4').astype('i4'))
    mesh_cache[key]=result
    return result

ctx=moderngl.create_standalone_context(backend='egl')
ctx.enable(moderngl.DEPTH_TEST | moderngl.BLEND)
ctx.blend_func=moderngl.SRC_ALPHA,moderngl.ONE_MINUS_SRC_ALPHA
program=ctx.program(vertex_shader='''#version 330
in vec3 pos; in vec3 normal; in vec2 uv;
uniform mat4 vp;
out vec3 N; out vec3 P; out vec2 UV;
void main(){P=pos;N=normal;UV=uv;gl_Position=vp*vec4(pos,1);}
''',fragment_shader='''#version 330
in vec3 N; in vec3 P; in vec2 UV;
uniform vec3 color; uniform vec3 emission; uniform bool logo;
uniform sampler2D tex; out vec4 outColor;
void main(){
 if(logo){vec4 c=texture(tex,UV);if(c.a<.05)discard;outColor=c;return;}
 vec3 n=normalize(N);float light=max(dot(n,normalize(vec3(-.4,.8,.35))),0.);
 float toon=smoothstep(.22,.55,light);
 vec3 c=color*(.68+.38*toon)+emission*.32;
 float ceilingLight=exp(-length(P-vec3(0.,2.65,-2.5))*.3);
 c+=color*.17*ceilingLight;
 outColor=vec4(c,1.);
}
''')
logo_image=Image.open(args.wordmark).convert('RGBA').transpose(Image.Transpose.FLIP_TOP_BOTTOM)
texture=ctx.texture(logo_image.size,4,logo_image.tobytes());texture.use(0)
program['tex']=0
items=[]
for kind,r in objects.values():
    if kind!=23 or not r['m_Enabled']:continue
    go=r['m_GameObject']['fileID']; tid=transforms.get(go)
    if not tid or not active(tid) or go not in filters:continue
    name=objects[go][1]['m_Name']
    if re.search('aurora|starfield|sunset|volumetric|beam',name,re.I):continue
    matid=r['m_Materials'][0]['fileID'] if r['m_Materials'] else 0
    if matid not in objects:continue
    mat=objects[matid][1]; name_mat=mat['m_Name']
    if re.search('aurora|stars|sunset|volumetric',name_mat,re.I):continue
    colors={k:v for item in mat['m_SavedProperties']['m_Colors'] for k,v in item.items()}
    col=vec(colors.get('_BaseColor',{'r':.2,'g':.2,'b':.2}), 'rgb')
    emission=vec(colors.get('_EmissionColor',{'r':0,'g':0,'b':0}), 'rgb')
    p,n,uv,ids=mesh(filters[go]['m_Mesh']['fileID'])
    if not len(p):continue
    m=world(tid)
    p=np.c_[p,np.ones(len(p))]@m.T;p=p[:,:3];p[:,2]*=-1
    n=n@np.linalg.inv(m[:3,:3]);n[:,2]*=-1
    array=np.c_[p,n,uv].astype('f4')
    vao=ctx.vertex_array(program,[(ctx.buffer(array.tobytes()),'3f 3f 2f','pos','normal','uv')],ctx.buffer(ids.tobytes()))
    items.append((vao,col,emission,'wordmark' in name_mat.lower()))
# The video surface is runtime-created; its bounds match QuestVideoScreenPrototype.
p,n,uv,ids=primitive(10202);p=p*np.array([3.8,2.1375,.015])+np.array([0,1.72,4.89]);p[:,2]*=-1;n[:,2]*=-1
vao=ctx.vertex_array(program,[(ctx.buffer(np.c_[p,n,uv].astype('f4').tobytes()),'3f 3f 2f','pos','normal','uv')],ctx.buffer(ids.tobytes()))
items.append((vao,np.array([.02,.025,.035]),np.zeros(3),False))

def camera(eye,target,fov,aspect):
    eye=np.array(eye,dtype=float);target=np.array(target,dtype=float);eye[2]*=-1;target[2]*=-1
    z=eye-target;z/=np.linalg.norm(z);x=np.cross([0,1,0],z);x/=np.linalg.norm(x);y=np.cross(z,x)
    view=np.eye(4);view[:3,:3]=np.array([x,y,z]);view[:3,3]=-view[:3,:3]@eye
    f=1/np.tan(np.radians(fov)/2);near=.04;far=40
    proj=np.array([[f/aspect,0,0,0],[0,f,0,0],[0,0,(far+near)/(near-far),2*far*near/(near-far)],[0,0,-1,0]])
    return (proj@view).astype('f4').T.tobytes()

width,height=1920,1200
fbo=ctx.simple_framebuffer((width,height),components=4);fbo.use()
output=root/'public/assets';output.mkdir(parents=True,exist_ok=True)
for name,eye,target,fov in [('opening',[2.15,1.8,-.8],[-.5,1.25,3],72),('front',[0,1.68,-1.15],[0,1.15,3.3],76)]:
    fbo.clear(.043,.051,.07,1)
    program['vp'].write(camera(eye,target,fov,width/height))
    for vao,color,emission,logo in items:
        program['color'].value=tuple(color);program['emission'].value=tuple(emission);program['logo'].value=logo;vao.render()
    img=Image.frombytes('RGBA',(width,height),fbo.read(components=4)).transpose(Image.Transpose.FLIP_TOP_BOTTOM).convert('RGB')
    img.save(output/f'product-room-{name}.webp',quality=91)
print(f'Rendered {len(items)} scene instances from {len(mesh_cache)} meshes')
