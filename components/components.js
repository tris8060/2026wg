/**
 * 组件加载系统
 * 用于动态加载导航栏和footer等公共组件
 */

// 组件加载器
const ComponentLoader = {
    // 基础路径配置
    basePath: '/components/',
    
    /**
     * 加载HTML组件到指定元素
     * @param {string} componentName - 组件文件名（不含扩展名）
     * @param {string} targetSelector - 目标元素选择器
     * @param {Function} callback - 加载完成后的回调函数
     */
    load: async function(componentName, targetSelector, callback) {
        try {
            const response = await fetch(this.basePath + componentName + '.html');
            if (!response.ok) {
                throw new Error(`Failed to load ${componentName}: ${response.status}`);
            }
            const html = await response.text();
            const target = document.querySelector(targetSelector);
            if (target) {
                target.innerHTML = html;
                // 重新初始化图标
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                // 执行回调
                if (callback && typeof callback === 'function') {
                    callback();
                }
                // 触发组件加载完成事件
                document.dispatchEvent(new CustomEvent('componentLoaded', { 
                    detail: { name: componentName, target: targetSelector } 
                }));
            } else {
                console.warn(`Target element ${targetSelector} not found`);
            }
        } catch (error) {
            console.error(`Error loading component ${componentName}:`, error);
        }
    },
    
    /**
     * 加载导航栏
     * @param {string} targetSelector - 目标元素选择器，默认为 '#nav-container'
     */
    loadNav: function(targetSelector = '#nav-container') {
        return this.load('nav', targetSelector, () => {
            this.initNavScripts();
        });
    },
    
    /**
     * 加载Footer
     * @param {string} targetSelector - 目标元素选择器，默认为 '#footer-container'
     */
    loadFooter: function(targetSelector = '#footer-container') {
        return this.load('footer', targetSelector, () => {
            // Footer加载完成后的初始化
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    },
    
    /**
     * 初始化导航栏相关的JavaScript功能
     */
    initNavScripts: function() {
        // 搜索框下拉交互逻辑
        const searchToggleBtn = document.getElementById('searchToggleBtn');
        const searchDropdownPanel = document.getElementById('searchDropdownPanel');
        const closeSearchBtn = document.getElementById('closeSearchBtn');

        if(searchToggleBtn && searchDropdownPanel) {
            function toggleSearch() {
                const isClosed = searchDropdownPanel.classList.contains('scale-y-0');
                if (isClosed) {
                    searchDropdownPanel.classList.remove('scale-y-0', 'opacity-0', 'invisible');
                    setTimeout(() => { 
                        const input = searchDropdownPanel.querySelector('input');
                        if (input) input.focus(); 
                    }, 300);
                } else {
                    searchDropdownPanel.classList.add('scale-y-0', 'opacity-0', 'invisible');
                }
            }
            searchToggleBtn.addEventListener('click', toggleSearch);
            if (closeSearchBtn) {
                closeSearchBtn.addEventListener('click', toggleSearch);
            }
        }

        // 导航栏滚动交互
        const nav = document.querySelector('nav');
        if (nav) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    nav.classList.add('shadow-sm');
                    if (nav.classList.contains('bg-white/80')) {
                        nav.classList.remove('bg-white/80');
                        nav.classList.add('bg-white/95');
                    }
                } else {
                    nav.classList.remove('shadow-sm');
                    if (nav.classList.contains('bg-white/95')) {
                        nav.classList.remove('bg-white/95');
                        nav.classList.add('bg-white/80');
                    }
                }
            });
        }

        // 移动端汉堡菜单交互逻辑
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
        
        if (mobileMenuBtn && mobileMenuDrawer) {
            mobileMenuBtn.addEventListener('click', () => {
                const isClosed = mobileMenuDrawer.classList.contains('translate-x-full');
                if (isClosed) {
                    mobileMenuDrawer.classList.remove('translate-x-full');
                    mobileMenuDrawer.classList.add('translate-x-0');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.setAttribute('data-lucide', 'x');
                        lucide.createIcons();
                    }
                } else {
                    mobileMenuDrawer.classList.remove('translate-x-0');
                    mobileMenuDrawer.classList.add('translate-x-full');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.setAttribute('data-lucide', 'menu');
                        lucide.createIcons();
                    }
                }
            });
        }

        // DIOS 超级菜单标签切换
        const diosTabBtns = document.querySelectorAll('.dios-tab-btn');
        const diosContentPanes = document.querySelectorAll('.dios-content-pane');
        
        diosTabBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                const target = btn.dataset.target;
                
                // 更新按钮样式
                diosTabBtns.forEach(b => {
                    b.classList.remove('font-bold', 'text-modern-dark', 'bg-white', 'border-indigo-600');
                    b.classList.add('font-medium', 'text-gray-500', 'border-transparent');
                });
                btn.classList.remove('font-medium', 'text-gray-500', 'border-transparent');
                btn.classList.add('font-bold', 'text-modern-dark', 'bg-white', 'border-indigo-600');
                
                // 切换内容面板
                diosContentPanes.forEach(pane => {
                    if (pane.id === target) {
                        pane.classList.remove('hidden');
                        pane.classList.add('block');
                    } else {
                        pane.classList.remove('block');
                        pane.classList.add('hidden');
                    }
                });
            });
        });

        // 行业产品标签切换
        const industryTabBtns = document.querySelectorAll('.industry-tab-btn');
        const industryContentPanes = document.querySelectorAll('.industry-content-pane');
        
        industryTabBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                const target = btn.dataset.target;
                
                // 更新按钮样式
                industryTabBtns.forEach(b => {
                    b.classList.remove('font-bold', 'text-modern-dark', 'bg-white', 'border-indigo-600');
                    b.classList.add('font-medium', 'text-gray-500', 'border-transparent');
                });
                btn.classList.remove('font-medium', 'text-gray-500', 'border-transparent');
                btn.classList.add('font-bold', 'text-modern-dark', 'bg-white', 'border-indigo-600');
                
                // 切换内容面板
                industryContentPanes.forEach(pane => {
                    if (pane.id === target) {
                        pane.classList.remove('hidden');
                        pane.classList.add('block');
                    } else {
                        pane.classList.remove('block');
                        pane.classList.add('hidden');
                    }
                });
            });
        });

        // 重新初始化所有图标
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
};

// 页面加载完成后自动加载组件
document.addEventListener('DOMContentLoaded', () => {
    // 如果有导航容器，自动加载导航
    if (document.getElementById('nav-container')) {
        ComponentLoader.loadNav();
    }
    // 如果有footer容器，自动加载footer
    if (document.getElementById('footer-container')) {
        ComponentLoader.loadFooter();
    }
});

// 导出组件加载器供全局使用
window.ComponentLoader = ComponentLoader;
