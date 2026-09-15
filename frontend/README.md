# MediCare frontend

## Deploy to Vercel

1. Import the repository into Vercel.
2. Set the project root directory to `frontend`.
3. Keep the framework preset as **Vite**.
4. Use `npm run build` as the build command and `dist` as the output directory.
5. Add these Vercel environment variables:

   ```text
   VITE_API_URL=https://your-backend-domain.example.com/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

6. Deploy the project.

The `vercel.json` rewrite keeps React Router routes working when a user opens or refreshes a nested URL directly.

## Backend CORS

After deployment, set `FRONTEND_URL` on the backend to the Vercel URL. Multiple frontend URLs can be separated with commas:

```text
FRONTEND_URL=https://your-project.vercel.app
```

Do not commit a real `.env` file or private Razorpay keys. Use `.env.example` as the local configuration template.
