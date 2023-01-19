"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/auth/[...nextauth]";
exports.ids = ["pages/api/auth/[...nextauth]"];
exports.modules = {

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ "next-auth/providers/github":
/*!*********************************************!*\
  !*** external "next-auth/providers/github" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/github");

/***/ }),

/***/ "(api)/./pages/api/auth/[...nextauth].ts":
/*!*****************************************!*\
  !*** ./pages/api/auth/[...nextauth].ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"authOptions\": () => (/* binding */ authOptions),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/github */ \"next-auth/providers/github\");\n/* harmony import */ var next_auth_providers_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_github__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst authOptions = {\n    providers: [\n        next_auth_providers_github__WEBPACK_IMPORTED_MODULE_1___default()({\n            clientId: process.env.CLIENT_ID,\n            clientSecret: process.env.CLIENT_SECRET,\n            authorization: {\n                url: \"https://github.com/login/oauth/authorize\",\n                params: {\n                    scope: \"repo\"\n                }\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token , account , profile  }) {\n            if (account) {\n                console.log(\"account\", account);\n                token.accessToken = account.access_token;\n                token.id = profile.id;\n            }\n            return token;\n        }\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (next_auth__WEBPACK_IMPORTED_MODULE_0___default()(authOptions));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFzRDtBQUNFO0FBR2pELE1BQU1FLGNBQWM7SUFDekJDLFdBQVc7UUFDVEYsaUVBQWNBLENBQUM7WUFDYkcsVUFBVUMsUUFBUUMsR0FBRyxDQUFDQyxTQUFTO1lBQy9CQyxjQUFjSCxRQUFRQyxHQUFHLENBQUNHLGFBQWE7WUFDdkNDLGVBQWU7Z0JBQ2JDLEtBQUs7Z0JBQ0xDLFFBQVE7b0JBQUVDLE9BQU87Z0JBQU87WUFDMUI7UUFDRjtLQUNEO0lBQ0RDLFdBQVc7UUFDVCxNQUFNQyxLQUFJLEVBQUVDLE1BQUssRUFBRUMsUUFBTyxFQUFFQyxRQUFPLEVBQU8sRUFBRTtZQUMxQyxJQUFJRCxTQUFTO2dCQUNYRSxRQUFRQyxHQUFHLENBQUMsV0FBV0g7Z0JBQ3ZCRCxNQUFNSyxXQUFXLEdBQUdKLFFBQVFLLFlBQVk7Z0JBQ3hDTixNQUFNTyxFQUFFLEdBQUdMLFFBQVFLLEVBQUU7WUFDdkIsQ0FBQztZQUNELE9BQU9QO1FBQ1Q7SUFLRjtBQUlGLEVBQUU7QUFFRixpRUFBZWhCLGdEQUFRQSxDQUFDRSxZQUFZQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXBwLy4vcGFnZXMvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS50cz8yZThiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOZXh0QXV0aCwgeyBOZXh0QXV0aE9wdGlvbnMgfSBmcm9tICduZXh0LWF1dGgnO1xuaW1wb3J0IEdpdGh1YlByb3ZpZGVyIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvZ2l0aHViJztcbmltcG9ydCB7IGdldFNlcnZlclNpZGVQcm9wcyB9IGZyb20gJy4uLy4uL2F1dGgvc2lnbmluJztcblxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zID0ge1xuICBwcm92aWRlcnM6IFtcbiAgICBHaXRodWJQcm92aWRlcih7XG4gICAgICBjbGllbnRJZDogcHJvY2Vzcy5lbnYuQ0xJRU5UX0lEIGFzIHN0cmluZyxcbiAgICAgIGNsaWVudFNlY3JldDogcHJvY2Vzcy5lbnYuQ0xJRU5UX1NFQ1JFVCBhcyBzdHJpbmcsXG4gICAgICBhdXRob3JpemF0aW9uOiB7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vZ2l0aHViLmNvbS9sb2dpbi9vYXV0aC9hdXRob3JpemUnLFxuICAgICAgICBwYXJhbXM6IHsgc2NvcGU6ICdyZXBvJyB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgY2FsbGJhY2tzOiB7XG4gICAgYXN5bmMgand0KHsgdG9rZW4sIGFjY291bnQsIHByb2ZpbGUgfTogYW55KSB7XG4gICAgICBpZiAoYWNjb3VudCkge1xuICAgICAgICBjb25zb2xlLmxvZygnYWNjb3VudCcsIGFjY291bnQpO1xuICAgICAgICB0b2tlbi5hY2Nlc3NUb2tlbiA9IGFjY291bnQuYWNjZXNzX3Rva2VuO1xuICAgICAgICB0b2tlbi5pZCA9IHByb2ZpbGUuaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdG9rZW47XG4gICAgfSxcbiAgICAvLyBhc3luYyByZWRpcmVjdCh7IHVybCwgYmFzZVVybCB9OiBhbnkpIHtcblxuICAgIC8vICAgcmV0dXJuIHVybDtcbiAgICAvLyB9LFxuICB9LFxuICAvLyBwYWdlczoge1xuICAvLyAgIHNpZ25JbjogJy9wYWN0LWNhdGFsb2cvYXV0aC9zaWduaW4nLFxuICAvLyB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgTmV4dEF1dGgoYXV0aE9wdGlvbnMpO1xuIl0sIm5hbWVzIjpbIk5leHRBdXRoIiwiR2l0aHViUHJvdmlkZXIiLCJhdXRoT3B0aW9ucyIsInByb3ZpZGVycyIsImNsaWVudElkIiwicHJvY2VzcyIsImVudiIsIkNMSUVOVF9JRCIsImNsaWVudFNlY3JldCIsIkNMSUVOVF9TRUNSRVQiLCJhdXRob3JpemF0aW9uIiwidXJsIiwicGFyYW1zIiwic2NvcGUiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsImFjY291bnQiLCJwcm9maWxlIiwiY29uc29sZSIsImxvZyIsImFjY2Vzc1Rva2VuIiwiYWNjZXNzX3Rva2VuIiwiaWQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/auth/[...nextauth].ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/auth/[...nextauth].ts"));
module.exports = __webpack_exports__;

})();