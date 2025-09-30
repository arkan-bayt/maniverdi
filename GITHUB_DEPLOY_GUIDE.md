# 🚀 دليل رفع موقع Mani Verdi على GitHub

## 📋 المتطلبات المسبقة

1. **حساب GitHub** - إنشاء حساب على [github.com](https://github.com)
2. **Git مثبت** - تحميل من [git-scm.com](https://git-scm.com)

## 🔧 الخطوات التفصيلية

### الخطوة 1: إعداد Git (لأول مرة فقط)

```bash
# تكوين المعلومات الشخصية
git config --global user.name "اسمك"
git config --global user.email "بريدك@example.com"
```

### الخطوة 2: إنشاء Repository على GitHub

1. **دخول إلى GitHub**: اذهب إلى [github.com](https://github.com)
2. **إنشاء Repository جديد**: 
   - اضغط على "+ New repository"
   - اسم المشروع: `mani-verdi-website`
   - الوصف: `Professional website for Mani Verdi services in Novara`
   - اختر: **Public** (أو Private إذا كنت تريد خصوصية)
   - ✅ لا تضع علامة على "Add a README file" (لأن لدينا واحد بالفعل)
   - اضغط "Create repository"

### الخطوة 3: إعداد المشروع للرفع

```bash
# الانتقال إلى مجلد المشروع
cd "/home/arkan/Desktop/mani verdi wep"

# تهيئة Git في المشروع
git init

# إضافة جميع الملفات
git add .

# أول commit
git commit -m "🎉 Initial commit: Complete Mani Verdi website with gallery, video, and PWA features"
```

### الخطوة 4: ربط المشروع بـ GitHub

```bash
# ربط المشروع بـ GitHub (استبدل USERNAME بـ اسم المستخدم الخاص بك)
git branch -M main
git remote add origin https://github.com/USERNAME/mani-verdi-website.git

# رفع الملفات إلى GitHub
git push -u origin main
```

### الخطوة 5: تفعيل GitHub Pages (لاستضافة مجانية)

1. **في repository على GitHub**:
   - اذهب إلى "Settings" في أعلى الصفحة
   - انزل إلى قسم "Pages" في القائمة اليسرى
   - في "Source": اختر "Deploy from a branch"
   - في "Branch": اختر "main"
   - في "Folder": اختر "/ (root)"
   - اضغط "Save"

2. **انتظار النشر**: سيستغرق بضع دقائق
3. **الرابط**: سيكون الموقع متاح على:
   ```
   https://USERNAME.github.io/mani-verdi-website/
   ```

## 📝 الأوامر الأساسية لـ Git

### رفع تحديثات جديدة:
```bash
# إضافة التغييرات
git add .

# حفظ التغييرات مع رسالة
git commit -m "✨ Add new feature or fix"

# رفع التحديثات
git push origin main
```

### التحقق من الحالة:
```bash
# معرفة حالة الملفات
git status

# رؤية تاريخ التعديلات
git log --oneline
```

### إدارة الفروع (Branches):
```bash
# إنشاء فرع جديد للتطوير
git checkout -b feature/new-feature

# العودة للفرع الرئيسي
git checkout main

# دمج الفرع الجديد
git merge feature/new-feature
```

## 🔐 الأمان والحماية

### حماية الملفات الحساسة:
1. **تحديث .gitignore** لحماية البيانات الحساسة
2. **استخدام Environment Variables** للمعلومات السرية
3. **عدم رفع كلمات المرور** في الكود

### مثال على .gitignore:
```
# Sensitive files
config/
*.env
admin-passwords.txt

# Temporary files
*.tmp
*.log
.DS_Store
```

## 🌐 استضافة إضافية

### GitHub Pages (مجاني):
- ✅ سهل الاستخدام
- ✅ نطاق فرعي مجاني (.github.io)
- ❌ فقط للمواقع الثابتة

### Netlify (مجاني):
1. سجل في [netlify.com](https://netlify.com)
2. اربط حساب GitHub
3. اختر المشروع
4. نشر تلقائي مع كل تحديث

### Vercel (مجاني):
1. سجل في [vercel.com](https://vercel.com)
2. استورد من GitHub
3. نشر فوري

## 🛠️ تحسينات ما بعد الرفع

### تحسين الأداء:
```bash
# ضغط الصور (إذا لم يتم بعد)
# استخدام WebP format
# تصغير CSS و JS
```

### إعداد نطاق مخصص:
1. **شراء النطاق** (example.com)
2. **إعداد DNS** ليشير إلى GitHub Pages
3. **تفعيل HTTPS** (تلقائي مع GitHub Pages)

### مراقبة الأداء:
- **Google Analytics** لتتبع الزوار
- **Google Search Console** لتحسين SEO
- **PageSpeed Insights** لقياس السرعة

## 📊 إحصائيات المشروع

### حجم الملفات:
- **الصور**: ~70MB (بعد الضغط)
- **الفيديو**: ~287MB
- **الكود**: ~5MB
- **المجموع**: ~362MB

### الميزات:
- ✅ 77 صورة محسنة
- ✅ فيديو تعريفي
- ✅ تصميم متجاوب
- ✅ PWA مكتمل
- ✅ SEO محسن
- ✅ أيقونة مخصصة

## 🆘 حل المشاكل الشائعة

### خطأ "Permission denied":
```bash
# إعداد SSH key
ssh-keygen -t rsa -b 4096 -c "your-email@example.com"
```

### خطأ "Repository not found":
```bash
# التحقق من الـ remote URL
git remote -v

# تحديث الـ remote URL
git remote set-url origin https://github.com/USERNAME/mani-verdi-website.git
```

### الملفات الكبيرة:
```bash
# استخدام Git LFS للملفات الكبيرة
git lfs track "*.mp4"
git add .gitattributes
```

## 📞 الدعم والمساعدة

- **GitHub Docs**: [docs.github.com](https://docs.github.com)
- **Git Tutorial**: [learngitbranching.js.org](https://learngitbranching.js.org)
- **Community**: [GitHub Community](https://github.community)

---

## 🎊 مبروك!

بعد اتباع هذه الخطوات، سيكون موقع Mani Verdi:
- 🌐 **متاحاً عالمياً** على الإنترنت
- 🔄 **محدث تلقائياً** مع كل تعديل
- 📱 **قابل للتثبيت** كتطبيق PWA
- 🚀 **سريع ومحسن** للأداء

**رابط الموقع سيكون**: `https://username.github.io/mani-verdi-website/`

---

**تم إنشاؤه بـ ❤️ لشركة Mani Verdi - نوفارا، إيطاليا 🇮🇹**