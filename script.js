import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  '你的SUPABASE_URL',
  '你的SUPABASE_ANON_KEY'
)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('survey-form');
    const successMessage = document.getElementById('success-message');
    const resetBtn = document.getElementById('reset-btn');

    // Q2 other
    const q2OtherCheckbox = document.getElementById('q2-other-checkbox');
    const q2OtherText = document.getElementById('q2-other-text');

    if(q2OtherText && q2OtherCheckbox) {
        q2OtherText.addEventListener('input', () => {
            if (q2OtherText.value.trim() !== '') {
                q2OtherCheckbox.checked = true;
            }
        });
    }

    // 🚀 送出表單
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.innerHTML = '提交中...';
        submitBtn.disabled = true;

        const formData = new FormData(form);

        const data = {
            q1: formData.get('q1'),
            q2: formData.getAll('q2[]'), // ⭐ 多選
            q2_other: formData.get('q2_other_text'),
            q3: formData.get('q3'),
            q4: formData.get('q4'),
            q5: formData.get('q5'),
            q6: formData.get('q6'),
            q7: formData.get('q7'),
            q8: formData.get('q8'),
            q9: formData.get('q9'),
            q10: formData.get('q10')
        };

        const { error } = await supabase
            .from('survey')
            .insert([data]);

        if (error) {
            alert('送出失敗');
            console.log(error);
            submitBtn.innerHTML = '提交問卷';
            submitBtn.disabled = false;
            return;
        }

        // ✅ 成功才顯示
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
    });

    // reset
    resetBtn.addEventListener('click', () => {
        form.reset();
        successMessage.classList.add('hidden');
        form.classList.remove('hidden');
    });
});
