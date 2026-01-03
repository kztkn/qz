import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/_index.tsx"), // トップページ
    route("quiz", "routes/quiz.tsx"), // /quiz
    route("result", "routes/result.tsx"), // /result
    route("create", "routes/create.tsx", { id: "create-quiz" }),
    route("edit/:id", "routes/create.tsx", { id: "edit-quiz" }),
    route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
