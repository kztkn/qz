import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/_index.tsx"), // トップページ
    route("quiz", "routes/quiz.tsx"), // /quiz
    route("result", "routes/result.tsx"), // /result
] satisfies RouteConfig;
