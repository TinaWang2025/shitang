// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航切换
    initNavigation();
    
    // 初始化统计时间筛选
    initTimeFilter();
    
    // 加载统计数据
    loadStatistics('day');
    
    // 加载菜品数据
    loadFoodData();
    
    // 加载厨师数据
    loadChefData();
    
    // 初始化弹窗关闭按钮
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // 初始化添加菜品按钮
    document.getElementById('add-food-btn').addEventListener('click', function() {
        document.getElementById('food-modal-title').textContent = '添加菜品';
        document.getElementById('food-id').value = '';
        document.getElementById('food-name').value = '';
        document.getElementById('food-image-preview').innerHTML = '';
        document.getElementById('food-form').reset();
        document.getElementById('food-modal').style.display = 'flex';
    });
    
    // 初始化添加厨师按钮
    document.getElementById('add-chef-btn').addEventListener('click', function() {
        document.getElementById('chef-modal-title').textContent = '添加厨师';
        document.getElementById('chef-id').value = '';
        document.getElementById('chef-name').value = '';
        document.getElementById('chef-image-preview').innerHTML = '';
        document.getElementById('chef-form').reset();
        document.getElementById('chef-modal').style.display = 'flex';
    });
    
    // 初始化菜品表单提交
    document.getElementById('food-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveFoodItem();
    });
    
    // 初始化厨师表单提交
    document.getElementById('chef-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveChefItem();
    });
    
    // 初始化图片预览
    document.getElementById('food-image').addEventListener('change', function() {
        previewImage(this, 'food-image-preview');
    });
    
    document.getElementById('chef-image').addEventListener('change', function() {
        previewImage(this, 'chef-image-preview');
    });
    
    // 初始化导出按钮
    document.getElementById('export-btn').addEventListener('click', exportData);
    
    // 初始化设置保存按钮
    document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
});

// 初始化导航切换
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有链接的active类
            navLinks.forEach(l => l.classList.remove('active'));
            
            // 添加当前链接的active类
            this.classList.add('active');
            
            // 获取目标页面
            const target = this.getAttribute('data-page');
            
            // 隐藏所有页面内容
            document.querySelectorAll('.admin-page-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 显示目标页面内容
            document.getElementById(target + '-page').classList.add('active');
        });
    });
}

// 初始化统计时间筛选
function initTimeFilter() {
    const timeBtns = document.querySelectorAll('.time-btn');
    
    timeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有时间按钮的active类
            timeBtns.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 获取时间范围
            const timeRange = this.getAttribute('data-time');
            
            // 加载对应时间范围的统计数据
            loadStatistics(timeRange);
        });
    });
}

// 加载统计数据
function loadStatistics(timeRange) {
    // 模拟加载统计数据
    // 在实际应用中，这里应该是从后端API获取数据
    
    // 获取评分数据
    const foodRatings = JSON.parse(localStorage.getItem('food_ratings')) || [];
    const chefRatings = JSON.parse(localStorage.getItem('chef_ratings')) || [];
    
    // 根据时间范围筛选数据
    const filteredFoodRatings = filterRatingsByTime(foodRatings, timeRange);
    const filteredChefRatings = filterRatingsByTime(chefRatings, timeRange);
    
    // 计算统计数据
    const totalRatings = filteredFoodRatings.length + filteredChefRatings.length;
    
    // 计算平均评分
    let totalScore = 0;
    let ratingCount = 0;
    
    filteredFoodRatings.forEach(rating => {
        if (rating.taste) {
            totalScore += rating.taste;
            ratingCount++;
        }
        if (rating.appearance) {
            totalScore += rating.appearance;
            ratingCount++;
        }
    });
    
    filteredChefRatings.forEach(rating => {
        if (rating.service) {
            totalScore += rating.service;
            ratingCount++;
        }
        if (rating.skill) {
            totalScore += rating.skill;
            ratingCount++;
        }
    });
    
    const averageRating = ratingCount > 0 ? (totalScore / ratingCount).toFixed(1) : '0.0';
    
    // 更新统计卡片
    document.getElementById('total-ratings').textContent = totalRatings;
    document.getElementById('average-rating').textContent = averageRating;
    
    // 计算最高评分菜品和厨师
    const topFood = getTopRatedFood(filteredFoodRatings);
    const topChef = getTopRatedChef(filteredChefRatings);
    
    document.getElementById('top-food').textContent = topFood ? topFood.name : '暂无数据';
    document.getElementById('top-chef').textContent = topChef ? topChef.name : '暂无数据';
    
    // 这里还可以添加更多统计图表的生成逻辑
}

// 根据时间范围筛选评分数据
function filterRatingsByTime(ratings, timeRange) {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
        case 'day':
            // 今天凌晨
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            // 本周一
            const day = now.getDay() || 7; // 将周日从0转换为7
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1);
            break;
        case 'month':
            // 本月1号
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        default:
            return ratings;
    }
    
    return ratings.filter(rating => {
        const ratingDate = new Date(rating.timestamp);
        return ratingDate >= startDate;
    });
}

// 获取最高评分菜品
function getTopRatedFood(ratings) {
    if (ratings.length === 0) return null;
    
    // 按菜品ID分组
    const foodGroups = {};
    
    ratings.forEach(rating => {
        if (!foodGroups[rating.foodId]) {
            foodGroups[rating.foodId] = {
                totalScore: 0,
                count: 0
            };
        }
        
        if (rating.taste) {
            foodGroups[rating.foodId].totalScore += rating.taste;
            foodGroups[rating.foodId].count++;
        }
        
        if (rating.appearance) {
            foodGroups[rating.foodId].totalScore += rating.appearance;
            foodGroups[rating.foodId].count++;
        }
    });
    
    // 计算平均分
    for (const foodId in foodGroups) {
        foodGroups[foodId].average = foodGroups[foodId].totalScore / foodGroups[foodId].count;
    }
    
    // 找出最高分的菜品
    let topFoodId = null;
    let topAverage = 0;
    
    for (const foodId in foodGroups) {
        if (foodGroups[foodId].average > topAverage) {
            topAverage = foodGroups[foodId].average;
            topFoodId = foodId;
        }
    }
    
    // 获取菜品信息
    const foods = JSON.parse(localStorage.getItem('canteen_foods')) || [];
    return foods.find(food => food.id.toString() === topFoodId);
}

// 获取最高评分厨师
function getTopRatedChef(ratings) {
    if (ratings.length === 0) return null;
    
    // 按厨师ID分组
    const chefGroups = {};
    
    ratings.forEach(rating => {
        if (!chefGroups[rating.chefId]) {
            chefGroups[rating.chefId] = {
                totalScore: 0,
                count: 0
            };
        }
        
        if (rating.service) {
            chefGroups[rating.chefId].totalScore += rating.service;
            chefGroups[rating.chefId].count++;
        }
        
        if (rating.skill) {
            chefGroups[rating.chefId].totalScore += rating.skill;
            chefGroups[rating.chefId].count++;
        }
    });
    
    // 计算平均分
    for (const chefId in chefGroups) {
        chefGroups[chefId].average = chefGroups[chefId].totalScore / chefGroups[chefId].count;
    }
    
    // 找出最高分的厨师
    let topChefId = null;
    let topAverage = 0;
    
    for (const chefId in chefGroups) {
        if (chefGroups[chefId].average > topAverage) {
            topAverage = chefGroups[chefId].average;
            topChefId = chefId;
        }
    }
    
    // 获取厨师信息
    const chefs = JSON.parse(localStorage.getItem('canteen_chefs')) || [];
    return chefs.find(chef => chef.id.toString() === topChefId);
}

// 加载菜品数据
function loadFoodData() {
    const foods = JSON.parse(localStorage.getItem('canteen_foods')) || [];
    const foodRatings = JSON.parse(localStorage.getItem('food_ratings')) || [];
    
    // 计算每个菜品的平均评分
    const foodScores = {};
    
    foodRatings.forEach(rating => {
        if (!foodScores[rating.foodId]) {
            foodScores[rating.foodId] = {
                totalScore: 0,
                count: 0
            };
        }
        
        if (rating.taste) {
            foodScores[rating.foodId].totalScore += rating.taste;
            foodScores[rating.foodId].count++;
        }
        
        if (rating.appearance) {
            foodScores[rating.foodId].totalScore += rating.appearance;
            foodScores[rating.foodId].count++;
        }
    });
    
    // 渲染菜品列表
    const tableBody = document.querySelector('#food-table tbody');
    tableBody.innerHTML = '';
    
    foods.forEach(food => {
        const row = document.createElement('tr');
        
        // 计算平均评分
        let avgScore = '暂无评分';
        if (foodScores[food.id] && foodScores[food.id].count > 0) {
            avgScore = (foodScores[food.id].totalScore / foodScores[food.id].count).toFixed(1);
        }
        
        row.innerHTML = `
            <td>${food.id}</td>
            <td><img src="${food.image}" alt="${food.name}" class="img-thumbnail"></td>
            <td>${food.name}</td>
            <td>${avgScore}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${food.id}">编辑</button>
                <button class="action-btn delete-btn" data-id="${food.id}">删除</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 绑定编辑按钮事件
    document.querySelectorAll('#food-table .edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const foodId = this.getAttribute('data-id');
            editFoodItem(foodId);
        });
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('#food-table .delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const foodId = this.getAttribute('data-id');
            deleteFoodItem(foodId);
        });
    });
}

// 加载厨师数据
function loadChefData() {
    const chefs = JSON.parse(localStorage.getItem('canteen_chefs')) || [];
    const chefRatings = JSON.parse(localStorage.getItem('chef_ratings')) || [];
    
    // 计算每个厨师的平均评分
    const chefScores = {};
    
    chefRatings.forEach(rating => {
        if (!chefScores[rating.chefId]) {
            chefScores[rating.chefId] = {
                totalScore: 0,
                count: 0
            };
        }
        
        if (rating.service) {
            chefScores[rating.chefId].totalScore += rating.service;
            chefScores[rating.chefId].count++;
        }
        
        if (rating.skill) {
            chefScores[rating.chefId].totalScore += rating.skill;
            chefScores[rating.chefId].count++;
        }
    });
    
    // 渲染厨师列表
    const tableBody = document.querySelector('#chef-table tbody');
    tableBody.innerHTML = '';
    
    chefs.forEach(chef => {
        const row = document.createElement('tr');
        
        // 计算平均评分
        let avgScore = '暂无评分';
        if (chefScores[chef.id] && chefScores[chef.id].count > 0) {
            avgScore = (chefScores[chef.id].totalScore / chefScores[chef.id].count).toFixed(1);
        }
        
        row.innerHTML = `
            <td>${chef.id}</td>
            <td><img src="${chef.image}" alt="${chef.name}" class="img-thumbnail"></td>
            <td>${chef.name}</td>
            <td>${avgScore}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${chef.id}">编辑</button>
                <button class="action-btn delete-btn" data-id="${chef.id}">删除</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 绑定编辑按钮事件
    document.querySelectorAll('#chef-table .edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const chefId = this.getAttribute('data-id');
            editChefItem(chefId);
        });
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('#chef-table .delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const chefId = this.getAttribute('data-id');
            deleteChefItem(chefId);
        });
    });
}

// 编辑菜品
function editFoodItem(foodId) {
    const foods = JSON.parse(localStorage.getItem('canteen_foods')) || [];
    const food = foods.find(f => f.id.toString() === foodId);
    
    if (food) {
        document.getElementById('food-modal-title').textContent = '编辑菜品';
        document.getElementById('food-id').value = food.id;
        document.getElementById('food-name').value = food.name;
        
        const preview = document.getElementById('food-image-preview');
        preview.innerHTML = `<img src="${food.image}" alt="${food.name}">`;
        
        document.getElementById('food-modal').style.display = 'flex';
    }
}

// 编辑厨师
function editChefItem(chefId) {
    const chefs = JSON.parse(localStorage.getItem('canteen_chefs')) || [];
    const chef = chefs.find(c => c.id.toString() === chefId);
    
    if (chef) {
        document.getElementById('chef-modal-title').textContent = '编辑厨师';
        document.getElementById('chef-id').value = chef.id;
        document.getElementById('chef-name').value = chef.name;
        
        const preview = document.getElementById('chef-image-preview');
        preview.innerHTML = `<img src="${chef.image}" alt="${chef.name}">`;
        
        document.getElementById('chef-modal').style.display = 'flex';
    }
}

// 删除菜品
function deleteFoodItem(foodId) {
    if (confirm('确定要删除这个菜品吗？')) {
        let foods = JSON.parse(localStorage.getItem('canteen_foods')) || [];
        foods = foods.filter(food => food.id.toString() !== foodId);
        localStorage.setItem('canteen_foods', JSON.stringify(foods));
        loadFoodData();
    }
}

// 删除厨师
function deleteChefItem(chefId) {
    if (confirm('确定要删除这个厨师吗？')) {
        let chefs = JSON.parse(localStorage.getItem('canteen_chefs')) || [];
        chefs = chefs.filter(chef => chef.id.toString() !== chefId);
        localStorage.setItem('canteen_chefs', JSON.stringify(chefs));
        loadChefData();
    }
}

// 预览图片
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    preview.innerHTML = '';
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

// 保存菜品
function saveFoodItem() {
    const foodId = document.getElementById('food-id').value;
    const foodName = document.getElementById('food-name').value;
    
    if (!foodName) {
        alert('请输入菜品名称');
        return;
    }
    
    // 获取现有菜品
    let foods = JSON.parse(localStorage.getItem('canteen_foods')) || [];
    
    // 获取图片
    const fileInput = document.getElementById('food-image');
    let imageUrl = '';
    
    if (foodId) {
        // 编辑模式，找到现有图片URL
        const existingFood = foods.find(food => food.id.toString() === foodId);
        imageUrl = existingFood ? existingFood.image : '';
    }
    
    // 如果上传了新图片
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imageUrl = e.target.result;
            saveFood();
        }
        
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        // 如果没有上传新图片，使用默认图片或现有图片
        if (!imageUrl) {
            imageUrl = `https://via.placeholder.com/300x200?text=${encodeURIComponent(foodName)}`;
        }
        saveFood();
    }
    
    function saveFood() {
        if (foodId) {
            // 编辑现有菜品
            const index = foods.findIndex(food => food.id.toString() === foodId);
            if (index !== -1) {
                foods[index].name = foodName;
                foods[index].image = imageUrl;
            }
        } else {
            // 添加新菜品
            const newId = foods.length > 0 ? Math.max(...foods.map(food => food.id)) + 1 : 1;
            foods.push({
                id: newId,
                name: foodName,
                image: imageUrl
            });
        }
        
        // 保存到本地存储
        localStorage.setItem('canteen_foods', JSON.stringify(foods));
        
        // 关闭弹窗
        document.getElementById('food-modal').style.display = 'none';
        
        // 刷新列表
        loadFoodData();
    }
}

// 保存厨师
function saveChefItem() {
    const chefId = document.getElementById('chef-id').value;
    const chefName = document.getElementById('chef-name').value;
    
    if (!chefName) {
        alert('请输入厨师姓名');
        return;
    }
    
    // 获取现有厨师
    let chefs = JSON.parse(localStorage.getItem('canteen_chefs')) || [];
    
    // 获取图片
    const fileInput = document.getElementById('chef-image');
    let imageUrl = '';
    
    if (chefId) {
        // 编辑模式，找到现有图片URL
        const existingChef = chefs.find(chef => chef.id.toString() === chefId);
        imageUrl = existingChef ? existingChef.image : '';
    }
    
    // 如果上传了新图片
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imageUrl = e.target.result;
            saveChef();
        }
        
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        // 如果没有上传新图片，使用默认图片或现有图片
        if (!imageUrl) {
            imageUrl = `https://via.placeholder.com/300x200?text=${encodeURIComponent(chefName)}`;
        }
        saveChef();
    }
    
    function saveChef() {
        if (chefId) {
            // 编辑现有厨师
            const index = chefs.findIndex(chef => chef.id.toString() === chefId);
            if (index !== -1) {
                chefs[index].name = chefName;
                chefs[index].image = imageUrl;
            }
        } else {
            // 添加新厨师
            const newId = chefs.length > 0 ? Math.max(...chefs.map(chef => chef.id)) + 1 : 1;
            chefs.push({
                id: newId,
                name: chefName,
                image: imageUrl
            });
        }
        
        // 保存到本地存储
        localStorage.setItem('canteen_chefs', JSON.stringify(chefs));
        
        // 关闭弹窗
        document.getElementById('chef-modal').style.display = 'none';
        
        // 刷新列表
        loadChefData();
    }
}

// 导出数据
function exportData() {
    const exportType = document.getElementById('export-type').value;
    const exportTime = document.getElementById('export-time').value;
    const exportFormat = document.getElementById('export-format').value;
    
    // 获取评分数据
    let data = [];
    
    if (exportType === 'all' || exportType === 'food') {
        const foodRatings = JSON.parse(localStorage.getItem('food_ratings')) || [];
        data = data.concat(foodRatings);
    }
    
    if (exportType === 'all' || exportType === 'chef') {
        const chefRatings = JSON.parse(localStorage.getItem('chef_ratings')) || [];
        data = data.concat(chefRatings);
    }
    
    // 按时间筛选
    if (exportTime !== 'all') {
        data = filterRatingsByTime(data, exportTime === 'today' ? 'day' : exportTime);
    }
    
    // 转换为CSV格式
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // 添加表头
    csvContent += 'ID,类型,评分项目,评分,时间\n';
    
    // 添加数据行
    data.forEach(item => {
        if (item.foodId) {
            if (item.taste) {
                csvContent += `${item.foodId},菜品,口味,${item.taste},${item.timestamp}\n`;
            }
            if (item.appearance) {
                csvContent += `${item.foodId},菜品,外观,${item.appearance},${item.timestamp}\n`;
            }
        } else if (item.chefId) {
            if (item.service) {
                csvContent += `${item.chefId},厨师,服务态度,${item.service},${item.timestamp}\n`;
            }
            if (item.skill) {
                csvContent += `${item.chefId},厨师,专业技能,${item.skill},${item.timestamp}\n`;
            }
        }
    });
    
    // 创建下载链接
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `食堂评价数据_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    
    // 触发下载
    link.click();
    
    // 移除链接
    document.body.removeChild(link);
}

// 保存设置
function saveSettings() {
    const systemName = document.getElementById('system-name').value;
    const footerText = document.getElementById('footer-text').value;
    const dataReset = document.getElementById('data-reset').value;
    
    // 保存设置到本地存储
    const settings = {
        systemName,
        footerText,
        dataReset
    };
    
    localStorage.setItem('canteen_settings', JSON.stringify(settings));
    
    // 更新页面显示
    document.querySelectorAll('header h1').forEach(h1 => {
        if (h1.textContent.includes('食堂评价系统')) {
            h1.textContent = h1.textContent.replace('食堂评价系统', systemName);
        }
    });
    
    document.querySelectorAll('footer p').forEach(p => {
        p.textContent = footerText;
    });
    
    alert('设置已保存');
} 
