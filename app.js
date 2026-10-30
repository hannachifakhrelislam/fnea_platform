"use strict";

// عنوان استقبال الطلبات.
// محليًا مع server.py:  "/api/applications"
// مع Google Sheets:     ضع رابط Apps Script الذي ينتهي بـ /exec
const API_URL = "https://script.google.com/macros/s/AKfycbxRmgj2G2ToTLwQq0l6uy0Mm7PAufwFENbBWuA-t5NQej_c3fsuJHYqUS8drryPV1ZqSQ/exec";
const IS_EXTERNAL_API = API_URL.startsWith("http");
const REQUEST_TIMEOUT_MS = 15000;

const WILAYAS = [
    "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار",
    "البليدة", "البويرة", "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر",
    "الجلفة", "جيجل", "سطيف", "سعيدة", "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة",
    "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة", "وهران", "البيض",
    "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي",
    "خنشلة", "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت",
    "غرداية", "غليزان", "تيميمون", "برج باجي مختار", "أولاد جلال", "بني عباس",
    "عين صالح", "عين قزام", "تقرت", "جانت", "المغير", "المنيعة", "أفلو", "بريكة",
    "القنطرة", "بئر العاتر", "العريشة", "قصر الشلالة", "مسعد", "عين وسارة", "بوسعادة",
    "الأبيض سيدي الشيخ", "القصر", "بني ونيف", "سيدي عيسى", "عين آزال",
    "قصر البخاري", "العلمة", "بوقطب", "تلاغ"
];

document.addEventListener("DOMContentLoaded", () => {
    fillWilayas();
    document.getElementById("current-year").textContent = new Date().getFullYear();
    initializeForm();
});

function fillWilayas() {
    const select = document.getElementById("wilaya");
    WILAYAS.forEach((name) => select.add(new Option(name, name)));
}

// يحوّل +213 / 00213 إلى 0 ويحذف الفراغات والشرطات
function normalizePhone(value) {
    const digits = value.replace(/[\s\-.()]/g, "");
    return digits.replace(/^(\+213|00213)/, "0");
}

function initializeForm() {
    const form = document.getElementById("membership-form");
    const message = document.getElementById("form-message");
    const submitButton = document.getElementById("submit-application");
    let isSending = false;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (isSending) return;

        clearInvalid(form);

        // حقل الفخ: الروبوتات تملؤه، فنتجاهل الطلب بصمت
        if (form.elements.website.value) {
            form.reset();
            showMessage(message, "تم تسجيل طلبك بنجاح.", "success");
            return;
        }

        const phone = normalizePhone(form.elements.phone.value);
        const problem = validate(form, phone);
        if (problem) {
            problem.field.classList.add("invalid");
            problem.field.focus();
            showMessage(message, problem.text, "error");
            return;
        }

        const application = {
            full_name: form.elements.full_name.value.trim(),
            email: form.elements.email.value.trim(),
            wilaya: form.elements.wilaya.value,
            phone: phone || null,
            university: form.elements.university.value.trim() || null,
            faculty: form.elements.faculty.value.trim() || null,
            degree: form.elements.degree.value.trim() || null,
            academic_year: form.elements.academic_year.value || null,
            student_message: form.elements.student_message.value.trim() || null
        };

        isSending = true;
        setButtonBusy(submitButton, true, "جارٍ إرسال الطلب...");
        showMessage(message, "", "");

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                // Apps Script لا يدعم preflight، لذا نرسل text/plain عند استعماله
                headers: {
                    "Content-Type": IS_EXTERNAL_API ? "text/plain;charset=utf-8" : "application/json"
                },
                body: JSON.stringify(application),
                signal: controller.signal
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || result.ok === false) {
                showMessage(message, result.error || "تعذر تسجيل الطلب. تحقق من المعلومات وحاول مجددًا.", "error");
                return;
            }

            form.reset();
            const suffix = result.id ? " رقم التسجيل: " + result.id : "";
            showMessage(message, "تم تسجيل طلبك بنجاح." + suffix, "success");
        } catch (error) {
            console.error("Application error (هل server.py شغّال؟):", error);
            showMessage(message, "تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مجددًا بعد قليل.", "error");
        } finally {
            clearTimeout(timer);
            isSending = false;
            setButtonBusy(submitButton, false, "إرسال طلب الانخراط");
        }
    });
}

function validate(form, phone) {
    const f = form.elements;

    if (!f.full_name.value.trim()) {
        return { field: f.full_name, text: "أدخل الاسم واللقب." };
    }
    if (!f.email.value.trim() || !f.email.checkValidity()) {
        return { field: f.email, text: "أدخل بريدًا إلكترونيًا صحيحًا." };
    }
    if (!f.wilaya.value) {
        return { field: f.wilaya, text: "اختر الولاية." };
    }
    if (phone && !/^0[567]\d{8}$/.test(phone)) {
        return { field: f.phone, text: "رقم الهاتف غير صحيح. مثال: 0550123456" };
    }
    return null;
}

function clearInvalid(form) {
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
}

function setButtonBusy(button, isBusy, label) {
    button.disabled = isBusy;
    button.textContent = label;
}

function showMessage(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.dataset.type = type;
}