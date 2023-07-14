# nullstack-adapter-vercel

Generate build files compatible with Vercel using [Build Output API](https://vercel.com/docs/build-output-api/v3)

## How to use

This script should run after the Nullstack produces it's normal builds, for example:

```json
"scripts": {
  "build": "nullstack build",
  "vercel-build": "npm run build && npx nullstack-adapt-vercel"
}
```

Then it will generate the **.vercel/output** folder using **.production** and **public** accordingly to [Vercel Build Output API](https://vercel.com/docs/build-output-api/v3) allowing to deploy seamlessly (e.g. running `vercel` from [Vercel CLI](https://vercel.com/docs/cli))

- It only does anything when `process.env.VERCEL` is truthy
- Takes inspiration from [@sveltejs/adapter-vercel](https://github.com/sveltejs/kit/tree/master/packages/adapter-vercel)

> 💡 `vercel-build` is the default script that Vercel itself runs when deploying, perfect to execute a script like this only there 🚀
