define(["exports","./Cartesian2-8417ca3d","./Math-4e53b694","./Transforms-a73b3b3b"],function(a,E,V,y){"use strict";var e={},u=new E.Cartesian3,m=new E.Cartesian3,c=new y.Quaternion,h=new y.Matrix3;function A(a,e,r,t,i,n,s,o,l,C){e=a+e;E.Cartesian3.multiplyByScalar(t,Math.cos(e),u),E.Cartesian3.multiplyByScalar(r,Math.sin(e),m),E.Cartesian3.add(u,m,u);e=Math.cos(a);e*=e;a=Math.sin(a);a*=a;a=n/Math.sqrt(s*e+i*a)/o;return y.Quaternion.fromAxisAngle(u,a,c),y.Matrix3.fromQuaternion(c,h),y.Matrix3.multiplyByVector(h,l,C),E.Cartesian3.normalize(C,C),E.Cartesian3.multiplyByScalar(C,o,C),C}var R=new E.Cartesian3,W=new E.Cartesian3,S=new E.Cartesian3,M=new E.Cartesian3;e.raisePositionsToHeight=function(a,e,r){for(var t=e.ellipsoid,i=e.height,n=e.extrudedHeight,e=r?a.length/3*2:a.length/3,s=new Float64Array(3*e),o=a.length,l=r?o:0,C=0;C<o;C+=3){var y=C+1,u=C+2,m=E.Cartesian3.fromArray(a,C,R);t.scaleToGeodeticSurface(m,m);var c=E.Cartesian3.clone(m,W),h=t.geodeticSurfaceNormal(m,M),x=E.Cartesian3.multiplyByScalar(h,i,S);E.Cartesian3.add(m,x,m),r&&(E.Cartesian3.multiplyByScalar(h,n,x),E.Cartesian3.add(c,x,c),s[C+l]=c.x,s[y+l]=c.y,s[u+l]=c.z),s[C]=m.x,s[y]=m.y,s[u]=m.z}return s};var b=new E.Cartesian3,B=new E.Cartesian3,Q=new E.Cartesian3;e.computeEllipsePositions=function(a,e,r){var t=a.semiMinorAxis,i=a.semiMajorAxis,n=a.rotation,s=a.center,a=8*a.granularity,o=t*t,l=i*i,C=i*t,y=E.Cartesian3.magnitude(s),u=E.Cartesian3.normalize(s,b),m=E.Cartesian3.cross(E.Cartesian3.UNIT_Z,s,B),m=E.Cartesian3.normalize(m,m),c=E.Cartesian3.cross(u,m,Q),h=1+Math.ceil(V.CesiumMath.PI_OVER_TWO/a),x=V.CesiumMath.PI_OVER_TWO/(h-1),M=V.CesiumMath.PI_OVER_TWO-h*x;M<0&&(h-=Math.ceil(Math.abs(M)/x));var z,f,_,d,O,p=e?new Array(3*(h*(h+2)*2)):void 0,w=0,P=R,T=W,a=4*h*3,I=a-1,g=0,v=r?new Array(a):void 0,P=A(M=V.CesiumMath.PI_OVER_TWO,n,c,m,o,C,l,y,u,P);for(e&&(p[w++]=P.x,p[w++]=P.y,p[w++]=P.z),r&&(v[I--]=P.z,v[I--]=P.y,v[I--]=P.x),M=V.CesiumMath.PI_OVER_TWO-x,z=1;z<h+1;++z){if(P=A(M,n,c,m,o,C,l,y,u,P),T=A(Math.PI-M,n,c,m,o,C,l,y,u,T),e){for(p[w++]=P.x,p[w++]=P.y,p[w++]=P.z,_=2*z+2,f=1;f<_-1;++f)d=f/(_-1),O=E.Cartesian3.lerp(P,T,d,S),p[w++]=O.x,p[w++]=O.y,p[w++]=O.z;p[w++]=T.x,p[w++]=T.y,p[w++]=T.z}r&&(v[I--]=P.z,v[I--]=P.y,v[I--]=P.x,v[g++]=T.x,v[g++]=T.y,v[g++]=T.z),M=V.CesiumMath.PI_OVER_TWO-(z+1)*x}for(z=h;1<z;--z){if(P=A(-(M=V.CesiumMath.PI_OVER_TWO-(z-1)*x),n,c,m,o,C,l,y,u,P),T=A(M+Math.PI,n,c,m,o,C,l,y,u,T),e){for(p[w++]=P.x,p[w++]=P.y,p[w++]=P.z,_=2*(z-1)+2,f=1;f<_-1;++f)d=f/(_-1),O=E.Cartesian3.lerp(P,T,d,S),p[w++]=O.x,p[w++]=O.y,p[w++]=O.z;p[w++]=T.x,p[w++]=T.y,p[w++]=T.z}r&&(v[I--]=P.z,v[I--]=P.y,v[I--]=P.x,v[g++]=T.x,v[g++]=T.y,v[g++]=T.z)}P=A(-(M=V.CesiumMath.PI_OVER_TWO),n,c,m,o,C,l,y,u,P);a={};return e&&(p[w++]=P.x,p[w++]=P.y,p[w++]=P.z,a.positions=p,a.numPts=h),r&&(v[I--]=P.z,v[I--]=P.y,v[I--]=P.x,a.outerPositions=v),a},a.EllipseGeometryLibrary=e});