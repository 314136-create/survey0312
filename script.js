import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://hjuhdebkjtesrpabnxnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqdWhkZWJranRlc3JwYWJueG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTA4NjAsImV4cCI6MjA4OTkyNjg2MH0.UZMpTWQkxrQh0xAXoUoLBk1wYXcUwmhnW6AmWyeHCig'
)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('survey-form');
    const successMessage = document.getElementById('success-message');
    const resetBtn = document.getElementById('reset-btn');

    // Q2 other：監聽輸入框，有打字就自動打勾
    const q2OtherCheckbox = document.getElementById('q2-other-checkbox');
    const q2OtherText = document.getElementById('q2-other-text');

    if(q2OtherText && q2OtherCheckbox) {
        q2OtherText.addEventListener('input', () => {
            if (q2OtherText.value.trim() !== '') {
                q2OtherCheckbox.checked = true;
            } else {
                q2OtherCheckbox.checked = false; // 如果清空了，順便取消打勾
            }
        });
    }

    // 🚀 送出表單
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 加上表單驗證，確保必填 (required) 都有填到
        if (!form.checkValidity()) {
            form.reportValidity(); // 觸發瀏覽器原生的必填提示
            return;
        }

        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.innerHTML = '提交中...';
        submitBtn.disabled = true;

        const formData = new FormData(form);

        const data = {
            q1: formData.get('q1'),
            q2: formData.getAll('q2[]'), // ⭐ 多選 (記得 Supabase 資料表要設為 text[] 或 jsonb)
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
            alert('送出失敗，請稍後再試！');
            console.error('Supabase Error:', error);
            submitBtn.innerHTML = '提交問卷 <span class="arrow">→</span>';
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
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.innerHTML = '提交問卷 <span class="arrow">→</span>';
        submitBtn.disabled = false;
        
        successMessage.classList.add('hidden');
        form.classList.remove('hidden');
    });
});
