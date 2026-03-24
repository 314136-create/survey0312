import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  '你的SUPABASE_URL',
  '你的SUPABASE_ANON_KEY'
)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('survey-form');
    const successMessage = document.getElementById('success-message');
    const resetBtn = document.getElementById('reset-btn');

    // Handle "Other" text input focus for Q2
    const q2OtherCheckbox = document.getElementById('q2-other-checkbox');
    const q2OtherText = document.getElementById('q2-other-text');
    
    if(q2OtherText && q2OtherCheckbox) {
        q2OtherText.addEventListener('input', () => {
            if (q2OtherText.value.trim() !== '') {
                q2OtherCheckbox.checked = true;
            }
        });
        q2OtherText.addEventListener('focus', () => {
            q2OtherCheckbox.checked = true;
        });
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const data = {
        q1: formData.get('q1'),
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
        .from('survey') // 你的資料表名稱
        .insert([data]);

    if (error) {
        alert('送出失敗');
        console.log(error);
        return;
    }

    // 成功才顯示動畫
    form.classList.add('hidden');
    successMessage.classList.remove('hidden');
});
        
        // Add submitting state to button
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '提交中...';
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;

        // Simulate network request
        setTimeout(() => {
            // Animate form out
            form.style.opacity = '0';
            form.style.transform = 'translateY(-20px)';
            form.style.transition = 'all 0.4s ease';
            
            setTimeout(() => {
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
                
                // Animate success message in
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(20px)';
                
                // Trigger reflow
                void successMessage.offsetWidth;
                
                successMessage.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                successMessage.style.opacity = '1';
                successMessage.style.transform = 'translateY(0)';
                
                // Reset button for future use
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            }, 400);
        }, 800);
    });

    // Handle reset button
    resetBtn.addEventListener('click', () => {
        // Reset form fields
        form.reset();
        
        // Animate success message out
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            successMessage.classList.add('hidden');
            form.classList.remove('hidden');
            
            // Animate form in
            form.style.opacity = '0';
            form.style.transform = 'translateY(20px)';
            
            // Trigger reflow
            void form.offsetWidth;
            
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }, 400);
    });
});
