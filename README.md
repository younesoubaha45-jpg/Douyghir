# موقع قرية دويغير

## الإعداد

### 1. Supabase
- افتح Supabase > SQL Editor
- انسخ محتوى `supabase-setup.sql` وشغّله

### 2. Vercel
- ارفع هاد المجلد على GitHub
- ربط GitHub مع Vercel
- أضف Environment Variables:
  - `SUPABASE_URL` = رابط مشروعك
  - `SUPABASE_SERVICE_KEY` = service_role key من Supabase > Settings > API
  - `ADMIN_SECRET` = كلمة سر من اختيارك (احفظها بأمان)

### 3. فتح لوحة التحكم
- روح لـ `https://your-site.vercel.app/#admin`
- أدخل `ADMIN_SECRET` اللي اخترتو
