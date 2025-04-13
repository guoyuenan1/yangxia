// 文字内容数组
const messages = [
    "阿琴",
    "生日快乐",
    "Happy Birthday",
    "愿你永远快乐",
    "健康平安",
    "心想事成",
    "笑口常开",
    "青春永驻",
    "幸福美满"
];

// 图片路径数组
const images = [
    "images/2017.03 貌似颐和园来着～.jpg",
    "images/2017.06 假装淑女的毕业娃.jpg",
    "images/2018.06 手机里难得的b612.jpg",
    "images/2019.04 北戴河大型逃离北京～.jpg",
    "images/2019.04 北戴河双胞胎～.jpg",
    "images/2019.06 六一快乐～.jpg",
    "images/2020.06 西安游记～.jpg",
    "images/2020.10 找呀找呀找朋友.jpg",
    "images/2025.02 西安，要有新身份咯～.jpg",
    "images/Welcome, Baby!.jpg"
];

// 页面元素
const homePage = document.getElementById('home-page');
const contentPage = document.getElementById('content-page');
const passwordInput = document.getElementById('password');
const enterBtn = document.getElementById('enter-btn');
const textDisplay = document.getElementById('text-display');
const imageSlideshow = document.getElementById('image-slideshow');
const returnBtn = document.getElementById('return-btn');
const balloonsContainer = document.querySelector('.balloons');
const fireworksCanvas = document.getElementById('fireworks');
const ctx = fireworksCanvas.getContext('2d');

// 音频元素
const bgMusic = new Audio('music/生日快乐.mp3');

// 初始化
function init() {
    createBalloons(20);
    setupEventListeners();
    resizeCanvas();
    bgMusic.loop = true;
}

// 创建气球
function createBalloons(count) {
    for (let i = 0; i < count; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // 随机颜色
        const hue = Math.floor(Math.random() * 360);
        balloon.style.background = `hsl(${hue}, 100%, 70%)`;
        
        // 随机位置和动画延迟
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.animationDelay = `${Math.random() * 5}s`;
        balloon.style.animationDuration = `${8 + Math.random() * 7}s`;
        
        balloonsContainer.appendChild(balloon);
    }
}

// 设置事件监听
function setupEventListeners() {
    enterBtn.addEventListener('click', checkPassword);
    returnBtn.addEventListener('click', returnToHome);
    window.addEventListener('resize', resizeCanvas);
}

// 密码验证
function checkPassword() {
    if (passwordInput.value === '930407') {
        homePage.classList.add('hidden');
        contentPage.classList.remove('hidden');
        bgMusic.play().catch(e => console.log('自动播放被阻止:', e));
        startContentShow();
    } else {
        alert('密码错误，请重新输入');
        passwordInput.value = '';
    }
}

// 返回首页
function returnToHome() {
    contentPage.classList.add('hidden');
    homePage.classList.remove('hidden');
    passwordInput.value = '';
    bgMusic.pause();
    bgMusic.currentTime = 0;
    location.reload(); // 重置所有状态
}

// 开始内容展示
function startContentShow() {
    let currentIndex = 0;
    
    // 显示文字内容
    const textInterval = setInterval(() => {
        if (currentIndex >= messages.length) {
            clearInterval(textInterval);
            showImages();
            return;
        }
        
        textDisplay.textContent = messages[currentIndex];
        textDisplay.style.opacity = 1;
        
        setTimeout(() => {
            textDisplay.style.opacity = 0;
        }, 2000);
        
        currentIndex++;
    }, 3000);
}

// 显示图片
function showImages() {
    imageSlideshow.classList.remove('hidden');
    
    // 创建图片容器和标题
    images.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide-container';
        const imageName = images[index].replace('.jpg','').replace('images/','');
        
        const img = document.createElement('img');
        img.src = src;
        img.alt = imageName;
        
        const title = document.createElement('div');
        title.className = 'slide-title';
        title.textContent = imageName;
        
        slide.appendChild(img);
        slide.appendChild(title);
        imageSlideshow.appendChild(slide);
    });
    
    const allContainers = imageSlideshow.querySelectorAll('.slide-container');
    let currentImgIndex = 0;
    
    // 显示第一张图片
    allContainers[currentImgIndex].style.opacity = 1;
    
    // 图片轮播
    const imgInterval = setInterval(() => {
        allContainers[currentImgIndex].style.opacity = 0;
        
        currentImgIndex = (currentImgIndex + 1) % allContainers.length;
        
        if (currentImgIndex === 0) {
            clearInterval(imgInterval);
            startFireworks();
            returnBtn.classList.remove('hidden');
            return;
        }
        
        allContainers[currentImgIndex].style.opacity = 1;
    }, 3000);
}

// 烟花效果
function startFireworks() {
    fireworksCanvas.classList.remove('hidden');
    
    // 烟花粒子数组
    const particles = [];
    
    // 烟花类
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            this.velocity = {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8
            };
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
        }
        
        update() {
            this.velocity.y += 0.05; // 重力
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= this.decay;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // 创建烟花
    function createFirework(x, y) {
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(x, y));
        }
    }
    
    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        
        // 随机生成新烟花
        if (Math.random() < 0.03) {
            createFirework(
                Math.random() * fireworksCanvas.width,
                Math.random() * fireworksCanvas.height / 2
            );
        }
        
        // 更新和绘制粒子
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // 移除透明度为0的粒子
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
    }
    
    animate();
}

// 调整画布大小
function resizeCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
}

// 初始化应用
window.onload = init;
