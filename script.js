(async()=>{
  const panels=[...document.querySelectorAll('.panel')];
  const openPanel=id=>{panels.forEach(p=>{const open=p.id===id;p.classList.toggle('open',open);p.setAttribute('aria-hidden',String(!open))})};
  document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.open)));
  document.querySelectorAll('.close').forEach(b=>b.addEventListener('click',()=>openPanel('')));
  try{
    const THREE=await import('https://esm.sh/three@0.169.0');
    const{OrbitControls}=await import('https://esm.sh/three@0.169.0/examples/jsm/controls/OrbitControls.js');
    const container=document.querySelector('#scene'),scene=new THREE.Scene();scene.background=new THREE.Color(0x0b1110);scene.fog=new THREE.FogExp2(0x0b1110,.018);
    const camera=new THREE.PerspectiveCamera(46,container.clientWidth/container.clientHeight,.1,120);camera.position.set(17,9,21);
    const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(container.clientWidth,container.clientHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;container.appendChild(renderer.domElement);
    const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(3,2,0);controls.enableDamping=true;controls.enablePan=true;controls.minDistance=6;controls.maxDistance=35;controls.maxPolarAngle=Math.PI/2.04;
    const mat=(color,rough=.8,emissive=0,intensity=0)=>new THREE.MeshStandardMaterial({color,roughness:rough,emissive,emissiveIntensity:intensity});
    const wall=mat(0x7f8b82),dark=mat(0x202924,.9),roof=mat(0x19221e,1),red=mat(0xff4936,.65,0x711007,.7),green=mat(0xbfff3c,.55,0x6fa916,2),blue=mat(0x3978a5,.7,0x123047,.5),moonMat=mat(0xeaf6bc,.8,0x869b38,.8);
    const interactive=[];
    function label(text,color='#ffffff',bg='rgba(0,0,0,.55)',w=512,h=128){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,w,h);x.fillStyle=color;x.font='700 38px Manrope, Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(text.toUpperCase(),w/2,h/2);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:t,transparent:true})}
    function marker(text,pos,scale,panel){const m=new THREE.Mesh(new THREE.PlaneGeometry(...scale),label(text));m.position.set(...pos);m.userData.panel=panel;interactive.push(m);return m}
    function makeHouse({x,z,scale=1,accent='projects',name='PROJECTS + RESEARCH'}){
      const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);
      const base=new THREE.Mesh(new THREE.BoxGeometry(7,4.6,6.2),wall);base.position.y=2.3;base.castShadow=base.receiveShadow=true;g.add(base);
      const r=new THREE.Mesh(new THREE.ConeGeometry(5.25,3,4),roof);r.rotation.y=Math.PI/4;r.position.y=6;r.scale.z=.88;r.castShadow=true;g.add(r);
      const chimney=new THREE.Mesh(new THREE.BoxGeometry(.75,2.2,.75),dark);chimney.position.set(1.7,6.5,-1);g.add(chimney);
      const doorPanel=accent==='projects'?'projects':'experience',doorMat=accent==='projects'?red:blue;
      const door=new THREE.Mesh(new THREE.BoxGeometry(1.75,3.15,.14),doorMat);door.position.set(-1.25,1.58,3.17);door.userData.panel=doorPanel;interactive.push(door);g.add(door);
      const doorLabel=marker(accent==='projects'?'PROJECTS':'EXPERIENCE',[-1.25,2.15,3.26],[1.5,.42],doorPanel);g.add(doorLabel);
      const leftWindow=new THREE.Mesh(new THREE.BoxGeometry(1.55,1.5,.14),accent==='projects'?green:blue);leftWindow.position.set(1.25,3.05,3.17);leftWindow.userData.panel=accent==='projects'?'research':'experience';interactive.push(leftWindow);g.add(leftWindow);
      const windowLabel=marker(accent==='projects'?'RESEARCH':'CAREER',[1.25,3.05,3.27],[1.35,.4],leftWindow.userData.panel);g.add(windowLabel);
      [-1.6,1.2].forEach(zz=>{const w=new THREE.Mesh(new THREE.BoxGeometry(1.25,1.25,.1),accent==='projects'?green:blue);w.rotation.y=Math.PI/2;w.position.set(3.56,2.55,zz);g.add(w)});
      const nameplate=marker(name,[0,5.05,3.2],[4.8,.58],doorPanel);g.add(nameplate);
      const porch=new THREE.PointLight(accent==='projects'?0xff4c38:0x52a8ff,18,10);porch.position.set(-1,3.2,4);g.add(porch);return g
    }
    const projectHouse=makeHouse({x:3,z:0,name:'PROJECTS / RESEARCH'}),experienceHouse=makeHouse({x:13,z:-8,scale:.82,accent:'experience',name:'EXPERIENCE'});
    const moon=new THREE.Mesh(new THREE.SphereGeometry(2.4,48,48),moonMat);moon.position.set(7,13,-9);moon.userData.panel='skills';interactive.push(moon);scene.add(moon);
    const moonLabel=marker('SKILLSETS',[7,10.2,-7.9],[4.2,.85],'skills');moonLabel.lookAt(camera.position);scene.add(moonLabel);
    const halo=new THREE.Mesh(new THREE.TorusGeometry(3.15,.035,8,100),new THREE.MeshBasicMaterial({color:0xbfff3c,transparent:true,opacity:.45}));halo.position.copy(moon.position);halo.rotation.x=1.2;scene.add(halo);
    const ground=new THREE.Mesh(new THREE.CircleGeometry(45,80),mat(0x142019,1));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
    const path1=new THREE.Mesh(new THREE.PlaneGeometry(2.2,22),mat(0x38423b,1));path1.rotation.x=-Math.PI/2;path1.rotation.z=-.13;path1.position.set(.4,.016,9);scene.add(path1);
    const path2=new THREE.Mesh(new THREE.PlaneGeometry(1.7,17),mat(0x303a34,1));path2.rotation.x=-Math.PI/2;path2.rotation.z=-.78;path2.position.set(9,.02,-2);scene.add(path2);
    for(let i=0;i<95;i++){const h=.2+Math.random()*.8,b=new THREE.Mesh(new THREE.ConeGeometry(.035,h,4),mat(i%8?0x28402d:0xbfff3c));const a=Math.random()*Math.PI*2,r=7+Math.random()*31;b.position.set(Math.cos(a)*r,h/2,Math.sin(a)*r);scene.add(b)}
    scene.add(new THREE.HemisphereLight(0xbdd0c2,0x08100a,1.25));const key=new THREE.DirectionalLight(0xe1ffea,3.4);key.position.set(-10,18,12);key.castShadow=true;key.shadow.mapSize.set(2048,2048);scene.add(key);const moonGlow=new THREE.PointLight(0xcfff73,35,32);moonGlow.position.copy(moon.position);scene.add(moonGlow);
    const starGeo=new THREE.BufferGeometry(),stars=[];for(let i=0;i<800;i++)stars.push((Math.random()-.5)*110,Math.random()*43+7,(Math.random()-.5)*90);starGeo.setAttribute('position',new THREE.Float32BufferAttribute(stars,3));scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xc9d4cc,size:.06,transparent:true,opacity:.7})));
    const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let hovered=null;
    function pick(e){const r=renderer.domElement.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width*2-1;pointer.y=-(e.clientY-r.top)/r.height*2+1;ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(interactive,false)[0];hovered=hit?.object||null;renderer.domElement.style.cursor=hovered?'pointer':'grab'}
    renderer.domElement.addEventListener('pointermove',pick);renderer.domElement.addEventListener('click',e=>{pick(e);if(hovered?.userData.panel)openPanel(hovered.userData.panel)});
    let zoomTimer;renderer.domElement.addEventListener('wheel',()=>{clearTimeout(zoomTimer);zoomTimer=setTimeout(()=>{if(!hovered?.userData.panel)return;const p=new THREE.Vector3();hovered.getWorldPosition(p);if(camera.position.distanceTo(p)<9.5)openPanel(hovered.userData.panel)},180)},{passive:true});
    const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();moon.position.y=13+Math.sin(t*.45)*.15;halo.position.y=moon.position.y;moon.rotation.y=t*.05;projectHouse.position.y=Math.sin(t*.5)*.025;experienceHouse.position.y=Math.sin(t*.5+1)*.025;moonLabel.lookAt(camera.position);controls.update();renderer.render(scene,camera)}animate();
    document.querySelector('#loading').remove();addEventListener('resize',()=>{camera.aspect=container.clientWidth/container.clientHeight;camera.updateProjectionMatrix();renderer.setSize(container.clientWidth,container.clientHeight)})
  }catch(error){document.querySelector('#loading').textContent='3D world requires an internet connection';console.error(error)}
})();
