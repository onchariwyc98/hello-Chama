const getStartedBtn = document.getElementById("getStartedBtn");
const getStartedContainer = document.getElementById("getStartedContainer");
const contentContainer = document.getElementById("contentContainer");
const stepProgressBar = document.getElementById("stepProgressBar");

let onboardingData = {
    group: {},
    activities: [],
    subModules: {},
    billing: "Trial",
    termsAccepted: false
};

// Function to load each step
function loadStep(stepFile, stepNum){
    getStartedContainer.style.display = 'none';
    fetch(stepFile)
        .then(r => {
            if(!r.ok) throw new Error(`${stepFile} not found`);
            return r.text();
        })
        .then(html => {
            contentContainer.innerHTML = html;
            stepProgressBar.style.width = `${stepNum*20}%`;
            stepProgressBar.className = 'progress-bar ' + (stepNum<4?'bg-info':(stepNum<5?'bg-warning':'bg-success'));

            // Attach submit handlers dynamically
            attachHandlers(stepFile, stepNum);
        })
        .catch(err => contentContainer.innerHTML = `<p class="text-danger">${err.message}</p>`);
}

// Attach handlers for each step
function attachHandlers(stepFile, stepNum){
    if(stepFile === 'step1_group.html'){
        const form = document.getElementById("groupForm");
        form.addEventListener('submit', e=>{
            e.preventDefault();
            onboardingData.group = {
                name: document.getElementById("groupName").value,
                description: document.getElementById("groupDescription").value
            };
            loadStep('step2_activities.html', 2);
        });
    }
    if(stepFile === 'step2_activities.html'){
        const form = document.getElementById("activitiesForm");
        form.addEventListener('submit', e=>{
            e.preventDefault();
            const checked = [...form.querySelectorAll('input[type="checkbox"]:checked')].map(c=>c.value);
            if(!checked.length){ alert('Select at least one activity'); return; }
            onboardingData.activities = checked;
            loadStep('step3_billing.html',3);
        });
    }
    if(stepFile === 'step3_billing.html'){
        const form = document.getElementById("billingForm");
        form.addEventListener('submit', e=>{
            e.preventDefault();
            const billing = form.querySelector('input[name="billing"]:checked').value;
            onboardingData.billing = billing;
            loadStep('step4_terms.html',4);
        });
    }
    if(stepFile === 'step4_terms.html'){
        const form = document.getElementById("termsForm");
        form.addEventListener('submit', e=>{
            e.preventDefault();
            if(!document.getElementById('acceptTerms').checked){ alert('Accept terms to continue'); return; }
            onboardingData.termsAccepted = true;
            loadStep('step5_welcome.html',5);
        });
    }
}

// Start onboarding
getStartedBtn.addEventListener('click', ()=>loadStep('step1_group.html',1));
