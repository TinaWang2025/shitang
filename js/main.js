// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化标签切换
    initTabs();
    
    // 加载数据
    loadData();
    
    // 初始化评分系统
    initRatingSystem();
    
    // 初始化提交按钮
    document.getElementById('submit-btn').addEventListener('click', submitRatings);
    
    // 初始化弹窗关闭按钮
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
});

// 初始化标签切换功能
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有标签按钮的active类
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 获取目标标签内容
            const target = this.getAttribute('data-tab');
            
            // 隐藏所有标签内容
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 显示目标标签内容
            document.getElementById(target + '-tab').classList.add('active');
        });
    });
}

// 加载菜品和厨师数据
function loadData() {
    // 模拟从本地存储或服务器获取数据
    // 在实际应用中，这里应该是从后端API获取数据
    
    // 获取存储的数据，如果没有则使用示例数据
    let foods = JSON.parse(localStorage.getItem('canteen_foods')) || getSampleFoods();
    let chefs = JSON.parse(localStorage.getItem('canteen_chefs')) || getSampleChefs();
    
    // 渲染菜品列表
    renderFoodItems(foods);
    
    // 渲染厨师列表
    renderChefItems(chefs);
}

// 获取示例菜品数据
function getSampleFoods() {
    return [
        {
            id: 1,
            name: '红烧排骨',
            image: 'https://via.placeholder.com/300x200?text=红烧排骨'
        },
        {
            id: 2,
            name: '清蒸鱼',
            image: 'https://via.placeholder.com/300x200?text=清蒸鱼'
        },
        {
            id: 3,
            name: '宫保鸡丁',
            image: 'https://via.placeholder.com/300x200?text=宫保鸡丁'
        },
        {
            id: 4,
            name: '麻婆豆腐',
            image: 'https://via.placeholder.com/300x200?text=麻婆豆腐'
        }
    ];
}

// 获取示例厨师数据
function getSampleChefs() {
    return [
        {
            id: 1,
            name: '张师傅',
            image: 'https://via.placeholder.com/300x200?text=张师傅'
        },
        {
            id: 2,
            name: '李师傅',
            image: 'https://via.placeholder.com/300x200?text=李师傅'
        },
        {
            id: 3,
            name: '王师傅',
            image: 'https://via.placeholder.com/300x200?text=王师傅'
        }
    ];
}

// 渲染菜品列表
function renderFoodItems(foods) {
    const container = document.getElementById('food-items');
    container.innerHTML = ''; // 清空容器
    
    if (foods.length === 0) {
        container.innerHTML = '<div class="loading">暂无菜品数据</div>';
        return;
    }
    
    foods.forEach(food => {
        // 克隆模板
        const template = document.getElementById('food-item-template');
        const clone = document.importNode(template.content, true);
        
        // 设置数据
        clone.querySelector('.item').setAttribute('data-id', food.id);
        clone.querySelector('.item-name').textContent = food.name;
        clone.querySelector('.item-image img').src = food.image;
        clone.querySelector('.item-image img').alt = food.name;
        
        // 添加到容器
        container.appendChild(clone);
    });
}

// 渲染厨师列表
function renderChefItems(chefs) {
    const container = document.getElementById('chef-items');
    container.innerHTML = ''; // 清空容器
    
    if (chefs.length === 0) {
        container.innerHTML = '<div class="loading">暂无厨师数据</div>';
        return;
    }
    
    chefs.forEach(chef => {
        // 克隆模板
        const template = document.getElementById('chef-item-template');
        const clone = document.importNode(template.content, true);
        
        // 设置数据
        clone.querySelector('.item').setAttribute('data-id', chef.id);
        clone.querySelector('.item-name').textContent = chef.name;
        clone.querySelector('.item-image img').src = chef.image;
        clone.querySelector('.item-image img').alt = chef.name;
        
        // 添加到容器
        container.appendChild(clone);
    });
}

// 初始化评分系统
function initRatingSystem() {
    // 选择所有评分容器
    const ratingContainers = document.querySelectorAll('.rating');
    
    ratingContainers.forEach(container => {
        const stars = container.querySelectorAll('i');
        
        // 为每个星星添加点击事件
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                updateRating(container, rating);
            });
            
            // 鼠标悬停效果
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                previewRating(container, rating);
            });
            
            // 鼠标离开效果
            star.addEventListener('mouseleave', function() {
                resetPreview(container);
            });
        });
    });
}

// 更新评分
function updateRating(container, rating) {
    // 存储当前评分
    container.setAttribute('data-rating', rating);
    
    // 更新星星显示
    const stars = container.querySelectorAll('i');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

// 预览评分
function previewRating(container, rating) {
    const stars = container.querySelectorAll('i');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

// 重置预览
function resetPreview(container) {
    const currentRating = parseInt(container.getAttribute('data-rating') || 0);
    const stars = container.querySelectorAll('i');
    
    stars.forEach((star, index) => {
        if (index < currentRating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

// 提交评分
function submitRatings() {
    // 获取当前活动的标签
    const activeTab = document.querySelector('.tab-content.active');
    const tabId = activeTab.id;
    
    if (tabId === 'food-tab') {
        submitFoodRatings();
    } else if (tabId === 'chef-tab') {
        submitChefRatings();
    }
}

// 提交菜品评分
function submitFoodRatings() {
    const foodItems = document.querySelectorAll('#food-tab .item');
    const ratings = [];
    
    foodItems.forEach(item => {
        const foodId = item.getAttribute('data-id');
        const tasteRating = item.querySelector('.rating[data-type="taste"]').getAttribute('data-rating') || 0;
        const appearanceRating = item.querySelector('.rating[data-type="appearance"]').getAttribute('data-rating') || 0;
        
        // 检查是否有评分
        if (tasteRating > 0 || appearanceRating > 0) {
            ratings.push({
                foodId: foodId,
                taste: parseInt(tasteRating),
                appearance: parseInt(appearanceRating),
                timestamp: new Date().toISOString()
            });
        }
    });
    
    if (ratings.length === 0) {
        alert('请至少给一个菜品进行评分');
        return;
    }
    
    // 保存评分数据
    saveRatings('food_ratings', ratings);
    
    // 显示成功提示
    showSuccessModal();
}

// 提交厨师评分
function submitChefRatings() {
    const chefItems = document.querySelectorAll('#chef-tab .item');
    const ratings = [];
    
    chefItems.forEach(item => {
        const chefId = item.getAttribute('data-id');
        const serviceRating = item.querySelector('.rating[data-type="service"]').getAttribute('data-rating') || 0;
        const skillRating = item.querySelector('.rating[data-type="skill"]').getAttribute('data-rating') || 0;
        
        // 检查是否有评分
        if (serviceRating > 0 || skillRating > 0) {
            ratings.push({
                chefId: chefId,
                service: parseInt(serviceRating),
                skill: parseInt(skillRating),
                timestamp: new Date().toISOString()
            });
        }
    });
    
    if (ratings.length === 0) {
        alert('请至少给一个厨师进行评分');
        return;
    }
    
    // 保存评分数据
    saveRatings('chef_ratings', ratings);
    
    // 显示成功提示
    showSuccessModal();
}

// 保存评分数据
function saveRatings(key, newRatings) {
    // 获取现有评分
    let existingRatings = JSON.parse(localStorage.getItem(key)) || [];
    
    // 添加新评分
    existingRatings = existingRatings.concat(newRatings);
    
    // 保存回本地存储
    localStorage.setItem(key, JSON.stringify(existingRatings));
}

// 显示成功提示弹窗
function showSuccessModal() {
    document.getElementById('success-modal').style.display = 'flex';
    
    // 重置所有评分
    document.querySelectorAll('.rating').forEach(container => {
        container.removeAttribute('data-rating');
        container.querySelectorAll('i').forEach(star => {
            star.className = 'far fa-star';
        });
    });
} 
