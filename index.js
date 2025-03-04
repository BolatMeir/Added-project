const coinSound = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3",
);
const paperSound = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3",
);

let totalAmount = 0;
let donationCount = 0;
let recentDonations = [];
let targetAmount = 0;

const container = document.getElementById("donation-container");
const totalDisplay = document.getElementById("total");
const targetDisplay = document.getElementById("targetDisplay");
const progressBar = document.getElementById("progress");
const progressPercentage = document.getElementById("progress-percentage");
const totalDonationsDisplay = document.getElementById("total-donations");
const donationCountDisplay = document.getElementById("donation-count");
const averageDonationDisplay = document.getElementById("average-donation");
const recentList = document.getElementById("recent-list");
const targetModal = document.getElementById("targetModal");

function formatCurrency(amount) {
    return amount.toFixed(2);
}

function updateProgress() {
    const percentage = (totalAmount / targetAmount) * 100;
    progressBar.style.width = `${Math.min(percentage, 100)}%`;
    progressPercentage.textContent = `${Math.min(percentage, 100).toFixed(1)}%`;
}

function updateStatistics() {
    totalDonationsDisplay.textContent = `$${formatCurrency(totalAmount)}`;
    donationCountDisplay.textContent = donationCount;
    const average = donationCount > 0 ? totalAmount / donationCount : 0;
    averageDonationDisplay.textContent = `$${formatCurrency(average)}`;
    updateProgress();
}

function updateRecentDonations(amount) {
    if (!recentList) return; 

    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    recentDonations.push({ amount, time: timeStr }); 

    recentList.innerHTML = '';

    recentDonations.forEach(donation => {
        const donationElement = document.createElement('div');
        donationElement.className = 'recent-donation';
        donationElement.innerHTML = `
            <span>${donation.time}</span>
            <span>$${formatCurrency(donation.amount)}</span>
        `;
        recentList.appendChild(donationElement);
    });

    recentList.scrollTop = recentList.scrollHeight;
}

function animateDonation(amount) {
    const isCoin = amount < 5;
    const element = document.createElement("div");
    element.className = isCoin ? "coin" : "bill";

    const startX = Math.random() * (container.clientWidth - 40);
    element.style.left = `${startX}px`;
    element.style.top = "-40px";

    container.appendChild(element);

    if (isCoin) {
        coinSound.currentTime = 0;
        coinSound.play().catch(console.error);
    } else {
        paperSound.currentTime = 0;
        paperSound.play().catch(console.error);
    }

    const animation = element.animate(
        [
            { transform: "translateY(0) rotate(0deg)" },
            {
                transform: `translateY(${container.clientHeight + 40}px) rotate(${720}deg)`,
            },
        ],
        {
            duration: 1000,
            easing: "ease-in",
        },
    );

    animation.onfinish = () => element.remove();
}

function donate(amount) {
    totalAmount += amount;
    donationCount++;

    totalDisplay.textContent = formatCurrency(totalAmount);
    updateStatistics();
    updateRecentDonations(amount);
    animateDonation(amount);
}

function setTarget(event) {
    event.preventDefault();
    const input = document.getElementById("targetAmount");
    const amount = parseFloat(input.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    targetAmount = amount;
    targetDisplay.textContent = formatCurrency(targetAmount);
    targetModal.style.display = "none";
    updateProgress();
}

document.addEventListener("DOMContentLoaded", () => {
    targetModal.style.display = "flex";

    if (recentList) {
        recentList.innerHTML = '<div class="recent-donation"><span>Әлі донаттар жоқ!</span></div>';
    }
});

function submitReview(event) {
    event.preventDefault();

    const nameInput = document.getElementById("reviewName");
    const textInput = document.getElementById("reviewText");
    const reviewsList = document.getElementById("reviewsList");

    const review = {
        name: nameInput.value,
        text: textInput.value,
        date: new Date()
    };

    reviews.push(review);

    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item';
    reviewElement.innerHTML = `
        <div class="review-header">
            <span class="review-name">${review.name}</span>
            <span class="review-date">${review.date.toLocaleString()}</span>
        </div>
        <div class="review-text">${review.text}</div>
    `;

    reviewsList.appendChild(reviewElement);

    nameInput.value = '';
    textInput.value = '';

    reviewsList.scrollTop = reviewsList.scrollHeight;
}


document.addEventListener("DOMContentLoaded", () => {
    targetModal.style.display = "flex";

    const reviewsList = document.getElementById("reviewsList");
    if (reviewsList && reviews.length === 0) {
        reviewsList.innerHTML = '<div class="review-item"><div class="review-text"></div></div>';
    }
});
