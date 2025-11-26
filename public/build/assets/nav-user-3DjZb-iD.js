import{c as a}from"./createLucideIcon-DQ0uzrfc.js";import{j as e,S as n}from"./app-DYAKcHNl.js";import{A as o,a as r,b as t}from"./avatar-BZEWERC7.js";import{D as g,a as u,b as j,d as f,e as d,g as y,c}from"./dropdown-menu-ChwWV6C9.js";import{u as N,f as b,g as k,h as w}from"./sidebar-D72yRY0x.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],_=a("badge-check",M);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"m7 15 5 5 5-5",key:"1hf1tw"}],["path",{d:"m7 9 5-5 5 5",key:"sgt6xg"}]],C=a("chevrons-up-down",v);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["path",{d:"M18 20a6 6 0 0 0-12 0",key:"1qehca"}],["circle",{cx:"12",cy:"10",r:"4",key:"1h16sb"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],l=a("circle-user-round",D);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]],A=a("log-out",S);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],U=a("plus",I);function B({user:s,auth:i}){const{isMobile:m}=N(),x=()=>{i.user.roles.some(p=>p.name==="cdrrmo_admin")&&(sessionStorage.removeItem("cra_year"),console.log("CRA year cleared for cdrrmo_admin")),n.post(route("logout"))},h=()=>{n.get(route("profile.edit"))};return e.jsx(b,{className:"bg-blue-100 rounded-xl",children:e.jsx(k,{children:e.jsxs(g,{children:[e.jsx(u,{asChild:!0,children:e.jsxs(w,{size:"lg",className:"data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",children:[e.jsxs(o,{className:"h-8 w-8 rounded-lg",children:[e.jsx(r,{src:s.role==="cdrrmo_admin"?"/images/cdrrmo.png":s.avatar,alt:s.name}),e.jsx(t,{className:"rounded-lg",children:e.jsx(l,{})})]}),e.jsxs("div",{className:"grid flex-1 text-left text-sm leading-tight",children:[e.jsx("span",{className:"truncate font-semibold",children:s.username}),e.jsx("span",{className:"truncate text-xs",children:s.email})]}),e.jsx(C,{className:"ml-auto size-4"})]})}),e.jsxs(j,{className:"w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg",side:m?"bottom":"right",align:"end",sideOffset:4,children:[e.jsx(f,{className:"p-0 font-normal",children:e.jsxs("div",{className:"flex items-center gap-2 px-1 py-1.5 text-left text-sm",children:[e.jsxs(o,{className:"h-8 w-8 rounded-lg",children:[e.jsx(r,{src:s.role==="cdrrmo_admin"?"/images/cdrrmo.png":s.avatar,alt:s.name}),e.jsx(t,{className:"rounded-lg",children:e.jsx(l,{})})]}),e.jsxs("div",{className:"grid flex-1 text-left text-sm leading-tight",children:[e.jsx("span",{className:"truncate font-semibold",children:s.username}),e.jsx("span",{className:"truncate text-xs",children:s.email})]})]})}),e.jsx(d,{}),e.jsx(y,{children:e.jsxs(c,{onClick:h,children:[e.jsx(_,{}),"Profile"]})}),e.jsx(d,{}),e.jsxs(c,{onClick:x,children:[e.jsx(A,{}),"Log out"]})]})]})})})}export{l as C,B as N,U as P,C as a};
