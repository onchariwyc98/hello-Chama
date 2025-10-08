// onboarding.js

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

// Start onboarding
getStartedBtn.addEventListener('click', () => loadStep('step1_group.html', 1));

// Function to load each step
function loadStep(stepFile, stepNum) {
    getStartedContainer.style.display = 'none';
    fetch(stepFile)
        .then(r => {
            if (!r.ok) throw new Error(`${stepFile} not found`);
            return r.text();
        })
        .then(html => {
            contentContainer.innerHTML = html;
            stepProgressBar.style.width = `${stepNum * 20}%`;
            stepProgressBar.className = 'progress-bar ' + (stepNum < 4 ? 'bg-info' : (stepNum < 5 ? 'bg-warning' : 'bg-success'));

            attachHandlers(stepFile, stepNum);
        })
        .catch(err => contentContainer.innerHTML = `<p class="text-danger">${err.message}</p>`);
}

// Attach handlers for each step
function attachHandlers(stepFile, stepNum) {

    // Step 1: Group
    if (stepFile === 'step1_group.html') {
        const form = document.getElementById("groupForm");
        form.addEventListener('submit', e => {
            e.preventDefault();
            onboardingData.group = {
                name: document.getElementById("groupName").value,
                description: document.getElementById("groupDescription").value
            };
            loadStep('step2_activities.html', 2);
        });
    }

    // Step 2: Activities (clickable cards)
    if (stepFile === 'step2_activities.html') {
        const form = document.getElementById("activitiesForm");
        const cards = form.querySelectorAll('.activity-card');
        let selectedActivities = [];

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const value = card.getAttribute('data-value');
                card.classList.toggle('selected');

                if (selectedActivities.includes(value)) {
                    selectedActivities = selectedActivities.filter(a => a !== value);
                } else {
                    selectedActivities.push(value);
                }
            });
        });

        form.addEventListener('submit', e => {
            e.preventDefault();
            if (!selectedActivities.length) {
                alert('Select at least one activity to continue.');
                return;
            }

            onboardingData.activities = selectedActivities;
            console.log('Selected activities:', selectedActivities);

            loadStep('step3_billing.html', 3);
        });
    }

    // Step 3: Billing
    if (stepFile === 'step3_billing.html') {
        const form = document.getElementById("billingForm");
        form.addEventListener('submit', e => {
            e.preventDefault();
            const billing = form.querySelector('input[name="billing"]:checked').value;
            onboardingData.billing = billing;
            loadStep('step4_terms.html', 4);
        });
    }

    // Step 4: Terms
    if (stepFile === 'step4_terms.html') {
        const form = document.getElementById("termsForm");
        form.addEventListener('submit', e => {
            e.preventDefault();
            if (!document.getElementById('acceptTerms').checked) {
                alert('Accept terms to continue');
                return;
            }
            onboardingData.termsAccepted = true;
            loadStep('step5_welcome.html', 5);
        });
    }

    // Step 5: Welcome / Final
    if (stepFile === 'step5_welcome.html') {
        const startBtn = document.getElementById("startAppBtn");
        startBtn.addEventListener('click', () => {
            console.log('Onboarding complete:', onboardingData);
            window.location.href = "../group_app/group_home.html";
        });
    }
}
