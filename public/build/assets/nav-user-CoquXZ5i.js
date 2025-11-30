import{c as a}from"./createLucideIcon-D5UG3oK1.js";import{j as e,S as o}from"./app-m0UtTjfp.js";import{A as r,a as n,b as t}from"./avatar-BFUdsy-I.js";import{D as u,a as j,b as f,d as y,e as c,g as N,c as d}from"./dropdown-menu-BR8acHxs.js";import{u as b,f as k,g as _,h as w}from"./sidebar-BqheeojX.js";import{t as l}from"./stringFormat-Dx_XIxG1.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],v=a("badge-check",M);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"m7 15 5 5 5-5",key:"1hf1tw"}],["path",{d:"m7 9 5-5 5 5",key:"sgt6xg"}]],D=a("chevrons-up-down",C);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=[["path",{d:"M18 20a6 6 0 0 0-12 0",key:"1qehca"}],["circle",{cx:"12",cy:"10",r:"4",key:"1h16sb"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],i=a("circle-user-round",A);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]],I=a("log-out",S);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],O=a("plus",L);function T({user:s,auth:m}){const{isMobile:x}=b(),h=()=>{m.user.roles.some(g=>g.name==="cdrrmo_admin")&&(sessionStorage.removeItem("cra_year"),console.log("CRA year cleared for cdrrmo_admin")),o.post(route("logout"))},p=()=>{o.get(route("profile.edit"))};return e.jsx(k,{className:"bg-blue-100 rounded-xl",children:e.jsx(_,{children:e.jsxs(u,{children:[e.jsx(j,{asChild:!0,children:e.jsxs(w,{size:"lg",className:"data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",children:[e.jsxs(r,{className:"h-8 w-8 rounded-lg",children:[e.jsx(n,{src:s.role==="cdrrmo_admin"?"/images/cdrrmo.png":s.avatar,alt:s.name}),e.jsx(t,{className:"rounded-lg",children:e.jsx(i,{})})]}),e.jsxs("div",{className:"grid flex-1 text-left text-sm leading-tight",children:[e.jsx("span",{className:"truncate font-semibold",children:s.username}),e.jsx("span",{className:"truncate text-xs",children:l(s.role.replaceAll("_"," "))})]}),e.jsx(D,{className:"ml-auto size-4"})]})}),e.jsxs(f,{className:"w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg",side:x?"bottom":"right",align:"end",sideOffset:4,children:[e.jsx(y,{className:"p-0 font-normal",children:e.jsxs("div",{className:"flex items-center gap-2 px-1 py-1.5 text-left text-sm",children:[e.jsxs(r,{className:"h-8 w-8 rounded-lg",children:[e.jsx(n,{src:s.role==="cdrrmo_admin"?"/images/cdrrmo.png":s.avatar,alt:s.name}),e.jsx(t,{className:"rounded-lg",children:e.jsx(i,{})})]}),e.jsxs("div",{className:"grid flex-1 text-left text-sm leading-tight",children:[e.jsx("span",{className:"truncate font-semibold",children:s.username}),e.jsx("span",{className:"truncate text-xs",children:l(s.role.replaceAll("_"," "))})]})]})}),e.jsx(c,{}),e.jsx(N,{children:e.jsxs(d,{onClick:p,children:[e.jsx(v,{}),"Account Profile"]})}),e.jsx(c,{}),e.jsxs(d,{onClick:h,children:[e.jsx(I,{}),"Log out"]})]})]})})})}export{i as C,T as N,O as P,D as a};
