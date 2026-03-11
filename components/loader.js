// 组件加载器 - 用于动态加载公共组件
class ComponentLoader {
    constructor() {
        this.components = {
            navbar: '/components/navbar.html',
            footer: '/components/footer.html'
        };
    }

    // 加载单个组件
    async loadComponent(componentName, containerSelector) {
        try {
            const response = await fetch(this.components[componentName]);
            if (!response.ok) {
                throw new Error(`Failed to load ${componentName} component`);
            }
            const html = await response.text();
            const container = document.querySelector(containerSelector);
            if (container) {
                container.innerHTML = html;
                // 组件加载完成后重新初始化Lucide图标
                if (window.lucide) {
                    lucide.createIcons();
                }
                // 触发组件加载完成事件
                this.initializeComponentEvents(componentName);
                // 强制浏览器重新计算样式，确保hover效果生效
                // 使用一种更可靠的方法：创建临时元素并添加到DOM
                const forceReflow = () => {
                    const tempElement = document.createElement('div');
                    tempElement.style.position = 'absolute';
                    tempElement.style.visibility = 'hidden';
                    tempElement.style.width = '1px';
                    tempElement.style.height = '1px';
                    document.body.appendChild(tempElement);
                    tempElement.offsetHeight; // 触发重排
                    document.body.removeChild(tempElement);
                };
                
                // 立即触发一次重排
                forceReflow();
                
                // 再通过requestAnimationFrame触发一次，确保所有样式都已应用
                requestAnimationFrame(() => {
                    forceReflow();
                });
            }
        } catch (error) {
            console.error(`Error loading ${componentName} component:`, error);
        }
    }

    // 初始化组件事件
    initializeComponentEvents(componentName) {
        if (componentName === 'navbar') {
            this.initializeNavbarEvents();
        }
    }

    // 初始化导航栏事件
    initializeNavbarEvents() {
        // 移动端菜单切换
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
        
        if (mobileMenuBtn && mobileMenuDrawer) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuDrawer.classList.toggle('translate-x-full');
            });
        }

        // 搜索面板切换
        const searchToggleBtn = document.getElementById('searchToggleBtn');
        const searchDropdownPanel = document.getElementById('searchDropdownPanel');
        const closeSearchBtn = document.getElementById('closeSearchBtn');
        
        if (searchToggleBtn && searchDropdownPanel) {
            searchToggleBtn.addEventListener('click', () => {
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
            });
        }

        if (closeSearchBtn && searchDropdownPanel) {
            closeSearchBtn.addEventListener('click', () => {
                searchDropdownPanel.classList.add('scale-y-0', 'opacity-0', 'invisible');
            });
        }

        // 点击页面其他区域关闭搜索面板
        document.addEventListener('click', (e) => {
            if (searchDropdownPanel && !searchToggleBtn?.contains(e.target) && !searchDropdownPanel.contains(e.target)) {
                searchDropdownPanel.classList.add('scale-y-0', 'opacity-0', 'invisible');
            }
        });

        // DIOS 超级菜单选项卡切换
        const diosTabBtns = document.querySelectorAll('.dios-tab-btn');
        const diosContentPanes = document.querySelectorAll('.dios-content-pane');
        
        diosTabBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                const target = btn.dataset.target;
                
                // 更新选项卡状态
                diosTabBtns.forEach(b => {
                    b.classList.remove('font-bold', 'text-modern-dark', 'bg-white', 'border-indigo-600');
                    b.classList.add('font-medium', 'text-gray-500', 'hover:text-modern-dark', 'hover:bg-gray-100', 'border-transparent');
                });
                
                btn.classList.remove('font-medium', 'text-gray-500', 'hover:text-modern-dark', 'hover:bg-gray-100', 'border-transparent');
                btn.classList.add('font-bold', 'text-modern-dark', 'bg-white', 'border-indigo-600');
                
                // 更新内容面板
                diosContentPanes.forEach(pane => {
                    pane.classList.add('hidden');
                });
                
                const targetPane = document.getElementById(target);
                if (targetPane) {
                    targetPane.classList.remove('hidden');
                }
            });
        });

        // 行业产品超级菜单选项卡切换
        const industryTabBtns = document.querySelectorAll('.industry-tab-btn');
        const industryContentPanes = document.querySelectorAll('.industry-content-pane');
        
        industryTabBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                const target = btn.dataset.target;
                
                // 更新选项卡状态
                industryTabBtns.forEach(b => {
                    b.classList.remove('font-bold', 'text-modern-dark', 'bg-white', 'border-indigo-600');
                    b.classList.add('font-medium', 'text-gray-500', 'hover:text-modern-dark', 'hover:bg-gray-100', 'border-transparent');
                });
                
                btn.classList.remove('font-medium', 'text-gray-500', 'hover:text-modern-dark', 'hover:bg-gray-100', 'border-transparent');
                btn.classList.add('font-bold', 'text-modern-dark', 'bg-white', 'border-indigo-600');
                
                // 更新内容面板
                industryContentPanes.forEach(pane => {
                    pane.classList.add('hidden');
                });
                
                const targetPane = document.getElementById(target);
                if (targetPane) {
                    targetPane.classList.remove('hidden');
                }
            });
        });
    }

    // 加载所有组件
    async loadAllComponents() {
        await Promise.all([
            this.loadComponent('navbar', '#navbar-container'),
            this.loadComponent('footer', '#footer-container')
        ]);
        // 组件加载完成后触发自定义事件
        window.dispatchEvent(new Event('componentsLoaded'));
    }
}

// 初始化组件加载器
if (typeof window !== 'undefined') {
    window.ComponentLoader = ComponentLoader;
    
    // 页面加载完成后加载组件
    console.log('Loader script loaded');
    
    // 确保DOMContentLoaded事件正确触发
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            console.log('DOMContentLoaded event fired');
            const loader = new ComponentLoader();
            await loader.loadAllComponents();
        });
    } else {
        console.log('DOM already loaded, loading components immediately');
        // DOM已经加载完成，直接执行
        (async () => {
            const loader = new ComponentLoader();
            await loader.loadAllComponents();
        })();
    }
}