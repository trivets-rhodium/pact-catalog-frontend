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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"authOptions\": () => (/* binding */ authOptions),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_github__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/github */ \"next-auth/providers/github\");\n/* harmony import */ var next_auth_providers_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_github__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst authOptions = {\n    providers: [\n        next_auth_providers_github__WEBPACK_IMPORTED_MODULE_1___default()({\n            // TO DO: improve error handling, in case environment variables are not provided?\n            clientId: process.env.CLIENT_ID,\n            clientSecret: process.env.CLIENT_SECRET,\n            authorization: {\n                url: \"https://github.com/login/oauth/authorize\",\n                params: {\n                    scope: \"repo\"\n                }\n            }\n        })\n    ],\n    callbacks: {\n        // TO DO: improve type safety, although these are heavily dependent on NextAuth?\n        async jwt ({ token , account , profile  }) {\n            if (account) {\n                token.accessToken = account.access_token;\n                token.user = profile;\n            }\n            return token;\n        },\n        async session ({ session , token  }) {\n            session.user = token.user;\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/pact-catalog/auth/signin\"\n    }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (next_auth__WEBPACK_IMPORTED_MODULE_0___default()(authOptions));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU1tQjtBQUVxQztBQUdqRCxNQUFNRSxjQUFjO0lBQ3pCQyxXQUFXO1FBQ1RGLGlFQUFjQSxDQUFDO1lBQ2IsaUZBQWlGO1lBQ2pGRyxVQUFVQyxRQUFRQyxHQUFHLENBQUNDLFNBQVM7WUFDL0JDLGNBQWNILFFBQVFDLEdBQUcsQ0FBQ0csYUFBYTtZQUN2Q0MsZUFBZTtnQkFDYkMsS0FBSztnQkFDTEMsUUFBUTtvQkFBRUMsT0FBTztnQkFBTztZQUMxQjtRQUNGO0tBQ0Q7SUFDREMsV0FBVztRQUNULGdGQUFnRjtRQUNoRixNQUFNQyxLQUFJLEVBQUVDLE1BQUssRUFBRUMsUUFBTyxFQUFFQyxRQUFPLEVBQU8sRUFBRTtZQUMxQyxJQUFJRCxTQUFTO2dCQUNYRCxNQUFNRyxXQUFXLEdBQUdGLFFBQVFHLFlBQVk7Z0JBQ3hDSixNQUFNSyxJQUFJLEdBQUdIO1lBQ2YsQ0FBQztZQUNELE9BQU9GO1FBQ1Q7UUFDQSxNQUFNTSxTQUFRLEVBQUVBLFFBQU8sRUFBRU4sTUFBSyxFQUFPLEVBQUU7WUFDckNNLFFBQVFELElBQUksR0FBR0wsTUFBTUssSUFBSTtZQUN6QixPQUFPQztRQUNUO0lBQ0Y7SUFDQUMsT0FBTztRQUNMQyxRQUFRO0lBQ1Y7QUFDRixFQUFFO0FBRUYsaUVBQWV4QixnREFBUUEsQ0FBQ0UsWUFBWUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2FwcC8uL3BhZ2VzL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0udHM/MmU4YiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTmV4dEF1dGgsIHtcbiAgQWNjb3VudCxcbiAgQXdhaXRhYmxlLFxuICBOZXh0QXV0aE9wdGlvbnMsXG4gIFByb2ZpbGUsXG4gIFNlc3Npb24sXG59IGZyb20gJ25leHQtYXV0aCc7XG5pbXBvcnQgeyBKV1QgfSBmcm9tICduZXh0LWF1dGgvand0JztcbmltcG9ydCBHaXRodWJQcm92aWRlciBmcm9tICduZXh0LWF1dGgvcHJvdmlkZXJzL2dpdGh1Yic7XG5pbXBvcnQgeyBnZXRTZXJ2ZXJTaWRlUHJvcHMgfSBmcm9tICcuLi8uLi9hdXRoL3NpZ25pbic7XG5cbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9ucyA9IHtcbiAgcHJvdmlkZXJzOiBbXG4gICAgR2l0aHViUHJvdmlkZXIoe1xuICAgICAgLy8gVE8gRE86IGltcHJvdmUgZXJyb3IgaGFuZGxpbmcsIGluIGNhc2UgZW52aXJvbm1lbnQgdmFyaWFibGVzIGFyZSBub3QgcHJvdmlkZWQ/XG4gICAgICBjbGllbnRJZDogcHJvY2Vzcy5lbnYuQ0xJRU5UX0lEIGFzIHN0cmluZyxcbiAgICAgIGNsaWVudFNlY3JldDogcHJvY2Vzcy5lbnYuQ0xJRU5UX1NFQ1JFVCBhcyBzdHJpbmcsXG4gICAgICBhdXRob3JpemF0aW9uOiB7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vZ2l0aHViLmNvbS9sb2dpbi9vYXV0aC9hdXRob3JpemUnLFxuICAgICAgICBwYXJhbXM6IHsgc2NvcGU6ICdyZXBvJyB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgY2FsbGJhY2tzOiB7XG4gICAgLy8gVE8gRE86IGltcHJvdmUgdHlwZSBzYWZldHksIGFsdGhvdWdoIHRoZXNlIGFyZSBoZWF2aWx5IGRlcGVuZGVudCBvbiBOZXh0QXV0aD9cbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgYWNjb3VudCwgcHJvZmlsZSB9OiBhbnkpIHtcbiAgICAgIGlmIChhY2NvdW50KSB7XG4gICAgICAgIHRva2VuLmFjY2Vzc1Rva2VuID0gYWNjb3VudC5hY2Nlc3NfdG9rZW47XG4gICAgICAgIHRva2VuLnVzZXIgPSBwcm9maWxlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH0sXG4gICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH06IGFueSkge1xuICAgICAgc2Vzc2lvbi51c2VyID0gdG9rZW4udXNlcjtcbiAgICAgIHJldHVybiBzZXNzaW9uO1xuICAgIH0sXG4gIH0sXG4gIHBhZ2VzOiB7XG4gICAgc2lnbkluOiAnL3BhY3QtY2F0YWxvZy9hdXRoL3NpZ25pbicsXG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBOZXh0QXV0aChhdXRoT3B0aW9ucyk7XG4iXSwibmFtZXMiOlsiTmV4dEF1dGgiLCJHaXRodWJQcm92aWRlciIsImF1dGhPcHRpb25zIiwicHJvdmlkZXJzIiwiY2xpZW50SWQiLCJwcm9jZXNzIiwiZW52IiwiQ0xJRU5UX0lEIiwiY2xpZW50U2VjcmV0IiwiQ0xJRU5UX1NFQ1JFVCIsImF1dGhvcml6YXRpb24iLCJ1cmwiLCJwYXJhbXMiLCJzY29wZSIsImNhbGxiYWNrcyIsImp3dCIsInRva2VuIiwiYWNjb3VudCIsInByb2ZpbGUiLCJhY2Nlc3NUb2tlbiIsImFjY2Vzc190b2tlbiIsInVzZXIiLCJzZXNzaW9uIiwicGFnZXMiLCJzaWduSW4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/auth/[...nextauth].ts\n");

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