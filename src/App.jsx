import React, { useState, useRef, useCallback } from 'react';
import { toPng, toSvg } from 'html-to-image';
import {
    Download,
    Plus,
    Trash2,
    ImagePlus,
    ArrowDown,
    Sparkles,
    FileImage,
    FileType,
} from 'lucide-react';

// ============================================================
// 默认数据 —— 按图片中的日程表初始化
// ============================================================
const createDefaultData = () => ({
    title: '🎀🎀 GAL批的情人节行程（萌萌版）(๑•̀ᴗ•́)و✧',
    columns: [
        {
            id: 'morning',
            label: '上午',
            items: [
                { id: 'm1', time: '8:00', action: '去打工店陪同事', reward: '巧克力+1', image: null },
                { id: 'm2', time: '9:00', action: '陪萝莉玩游戏', reward: '巧克力+1', image: null },
                { id: 'm3', time: '10:00', action: '和上司谈涨薪', reward: '巧克力+1', image: null },
                { id: 'm4', time: '11:00', action: '陪姐姐逛街', reward: '巧克力+1', image: null },
            ],
        },
        {
            id: 'afternoon',
            label: '下午',
            items: [
                { id: 'a1', time: '13:00', action: '向妹妹要零花钱', reward: '巧克力+1', image: null },
                { id: 'a2', time: '14:00', action: '去学校找损友聊天', reward: '巧克力+1', image: null },
                { id: 'a3', time: '15:00', action: '被老师留下补习', reward: '巧克力+1', image: null },
                { id: 'a4', time: '17:00', action: '陪幼驯染们打游戏', reward: '巧克力+2', image: null },
            ],
        },
        {
            id: 'evening',
            label: '晚上',
            items: [
                { id: 'e1', time: '19:00', action: '和女友烛光晚餐', reward: '巧克力+1', image: null },
                { id: 'e2', time: '20:00', action: '调戏同居室友', reward: '巧克力+1', image: null },
                { id: 'e3', time: '21:00', action: '逗逗邻居傻孩子', reward: '巧克力+1', image: null },
                { id: 'e4', time: '22:00', action: '喂食宠物，上床睡觉', reward: '', image: null },
            ],
        },
    ],
});

// ============================================================
// 事件卡片组件
// ============================================================
function EventCard({ item, onUpdate, onDelete, onImageUpload, rewardFontSize }) {
    const fileRef = useRef(null);

    return (
        <div className="flex flex-col items-center w-full group relative">
            {/* 删除按钮 */}
            <button
                className="control-btn absolute -top-2 -right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                onClick={onDelete}
                title="删除此项"
            >
                <Trash2 size={14} />
            </button>

            {/* 图片区域 */}
            <div
                className={`image-upload-zone rounded-lg border-2 border-dashed border-gray-300 bg-white flex items-center justify-center ${item.image ? 'p-1' : 'w-36 h-36 md:w-44 md:h-44'
                    }`}
                style={{ maxWidth: '200px', maxHeight: '200px' }}
                onClick={() => fileRef.current?.click()}
            >
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.action}
                        className="max-w-full max-h-[190px] rounded-lg object-contain"
                        draggable={false}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <ImagePlus size={32} />
                        <span className="text-xs mt-1">点击上传</span>
                    </div>
                )}
                <div className="upload-overlay rounded-lg">
                    <ImagePlus size={24} className="text-white" />
                </div>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onImageUpload(file);
                        e.target.value = '';
                    }}
                />
            </div>

            {/* 时间 + 描述 + 奖励 */}
            <div className="mt-2 w-full text-center space-y-0.5">
                <div className="flex items-center justify-center gap-1">
                    <input
                        className="editable-input font-bold text-sm w-16"
                        value={item.time}
                        onChange={(e) => onUpdate({ ...item, time: e.target.value })}
                        placeholder="时间"
                    />
                    <input
                        className="editable-input text-sm flex-1"
                        value={item.action}
                        onChange={(e) => onUpdate({ ...item, action: e.target.value })}
                        placeholder="事件描述"
                    />
                </div>
                {item.reward !== undefined && (
                    <input
                        className="editable-input text-orange-600 font-semibold"
                        style={{ fontSize: `${rewardFontSize}px` }}
                        value={item.reward}
                        onChange={(e) => onUpdate({ ...item, reward: e.target.value })}
                        placeholder="奖励（可选）"
                    />
                )}
            </div>
        </div>
    );
}

// ============================================================
// 红色箭头组件
// ============================================================
function RedArrow() {
    return (
        <div className="flex justify-center my-1 red-arrow">
            <ArrowDown size={36} strokeWidth={3.5} />
        </div>
    );
}

// ============================================================
// 单列时间线组件
// ============================================================
function TimelineColumn({ column, onUpdateItem, onDeleteItem, onAddItem, onImageUpload, rewardFontSize }) {
    return (
        <div className="flex flex-col items-center flex-1 min-w-[180px]">
            {/* 列标题 */}
            <h2 className="text-2xl font-black mb-4 tracking-widest text-gray-700">
                {column.label}
            </h2>

            {/* 卡片列表 */}
            <div className="flex flex-col items-center w-full gap-0">
                {column.items.map((item, idx) => (
                    <React.Fragment key={item.id}>
                        <EventCard
                            item={item}
                            onUpdate={(updated) => onUpdateItem(column.id, item.id, updated)}
                            onDelete={() => onDeleteItem(column.id, item.id)}
                            onImageUpload={(file) => onImageUpload(column.id, item.id, file)}
                            rewardFontSize={rewardFontSize}
                        />
                        {idx < column.items.length - 1 && <RedArrow />}
                    </React.Fragment>
                ))}
            </div>

            {/* 添加按钮 */}
            <button
                className="control-btn mt-4 flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors border border-dashed border-gray-300 hover:border-red-400 rounded-lg px-3 py-1.5"
                onClick={() => onAddItem(column.id)}
            >
                <Plus size={16} />
                添加事件
            </button>
        </div>
    );
}

// ============================================================
// 主应用
// ============================================================
export default function App() {
    const [data, setData] = useState(createDefaultData);
    const [rewardFontSize, setRewardFontSize] = useState(12);
    const exportRef = useRef(null);
    const [exporting, setExporting] = useState(false);

    // 更新标题
    const setTitle = useCallback((title) => {
        setData((prev) => ({ ...prev, title }));
    }, []);

    // 更新某个 item
    const updateItem = useCallback((columnId, itemId, updated) => {
        setData((prev) => ({
            ...prev,
            columns: prev.columns.map((col) =>
                col.id === columnId
                    ? {
                        ...col,
                        items: col.items.map((it) => (it.id === itemId ? updated : it)),
                    }
                    : col
            ),
        }));
    }, []);

    // 删除某个 item
    const deleteItem = useCallback((columnId, itemId) => {
        setData((prev) => ({
            ...prev,
            columns: prev.columns.map((col) =>
                col.id === columnId
                    ? { ...col, items: col.items.filter((it) => it.id !== itemId) }
                    : col
            ),
        }));
    }, []);

    // 添加 item
    const addItem = useCallback((columnId) => {
        const newItem = {
            id: `item_${Date.now()}`,
            time: '??:??',
            action: '新事件',
            reward: '巧克力+1',
            image: null,
        };
        setData((prev) => ({
            ...prev,
            columns: prev.columns.map((col) =>
                col.id === columnId ? { ...col, items: [...col.items, newItem] } : col
            ),
        }));
    }, []);

    // 图片上传
    const handleImageUpload = useCallback((columnId, itemId, file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            updateItem(columnId, itemId, {
                ...data.columns
                    .find((c) => c.id === columnId)
                    ?.items.find((i) => i.id === itemId),
                image: e.target?.result,
            });
        };
        reader.readAsDataURL(file);
    }, [data, updateItem]);

    // 导出为 PNG
    const exportPng = useCallback(async () => {
        if (!exportRef.current) return;
        setExporting(true);
        try {
            // 添加导出类以隐藏控制按钮
            exportRef.current.classList.add('export-target');
            const dataUrl = await toPng(exportRef.current, {
                pixelRatio: 3,
                backgroundColor: '#fdf6e3',
            });
            exportRef.current.classList.remove('export-target');

            const link = document.createElement('a');
            link.download = '日程表.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('导出失败:', err);
            alert('导出失败，请重试');
        } finally {
            exportRef.current?.classList.remove('export-target');
            setExporting(false);
        }
    }, []);

    // 导出为 SVG
    const exportSvg = useCallback(async () => {
        if (!exportRef.current) return;
        setExporting(true);
        try {
            exportRef.current.classList.add('export-target');
            const dataUrl = await toSvg(exportRef.current, {
                backgroundColor: '#fdf6e3',
            });
            exportRef.current.classList.remove('export-target');

            const link = document.createElement('a');
            link.download = '日程表.svg';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('SVG导出失败:', err);
            alert('SVG导出失败，请重试');
        } finally {
            exportRef.current?.classList.remove('export-target');
            setExporting(false);
        }
    }, []);

    // 重置数据
    const resetData = useCallback(() => {
        if (window.confirm('确定要重置所有内容吗？')) {
            setData(createDefaultData());
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-6 px-4">
            {/* ===== 工具栏 ===== */}
            <div className="max-w-5xl mx-auto mb-4 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                    <Sparkles size={22} className="text-yellow-500 twinkle" />
                    日程表生成器
                </h1>
                <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-300">
                        <label htmlFor="fontSize" className="whitespace-nowrap">字号:</label>
                        <select
                            id="fontSize"
                            value={rewardFontSize}
                            onChange={(e) => setRewardFontSize(Number(e.target.value))}
                            className="border-none outline-none bg-transparent cursor-pointer font-semibold"
                        >
                            <option value={10}>小 (10px)</option>
                            <option value={12}>中 (12px)</option>
                            <option value={14}>大 (14px)</option>
                            <option value={16}>特大 (16px)</option>
                            <option value={18}>超大 (18px)</option>
                            <option value={20}>巨大 (20px)</option>
                        </select>
                    </div>
                    <button
                        onClick={resetData}
                        className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                        重置
                    </button>
                    <button
                        onClick={exportSvg}
                        disabled={exporting}
                        className="px-3 py-2 text-sm rounded-lg bg-violet-500 hover:bg-violet-600 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                        <FileType size={16} />
                        导出 SVG
                    </button>
                    <button
                        onClick={exportPng}
                        disabled={exporting}
                        className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-md shadow-red-200"
                    >
                        <Download size={16} />
                        {exporting ? '导出中...' : '导出 PNG'}
                    </button>
                </div>
            </div>

            {/* ===== 主画布区域 ===== */}
            <div className="max-w-5xl mx-auto">
                <div
                    ref={exportRef}
                    className="bg-[#fdf6e3] rounded-2xl shadow-xl p-6 md:p-10"
                    style={{ minWidth: 700 }}
                >
                    {/* 标题 */}
                    <div className="text-center mb-8">
                        <input
                            className="editable-input text-2xl md:text-3xl font-black text-gray-800 tracking-wide"
                            value={data.title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ maxWidth: '100%' }}
                        />
                    </div>

                    {/* 三列布局 */}
                    <div className="flex gap-6 md:gap-10 justify-center items-start">
                        {data.columns.map((column) => (
                            <TimelineColumn
                                key={column.id}
                                column={column}
                                onUpdateItem={updateItem}
                                onDeleteItem={deleteItem}
                                onAddItem={addItem}
                                onImageUpload={handleImageUpload}
                                rewardFontSize={rewardFontSize}
                            />
                        ))}
                    </div>

                    {/* 底部装饰 */}
                    <div className="text-center mt-8 text-xs text-gray-400 select-none">
                        ✦ Made with ♥ by 白織 ✦
                    </div>
                </div>
            </div>

            {/* 页脚提示 */}
            <div className="max-w-5xl mx-auto mt-4 text-center text-xs text-gray-400 space-y-2">
                <p>💡 点击图片区域上传头像 · 所有文字均可直接编辑 · 鼠标悬停卡片显示删除按钮</p>
                <p>导出时控制按钮会自动隐藏，只保留内容</p>

                {/* GitHub 链接和访问量 */}
                <div className="flex items-center justify-center gap-3 pt-2">
                    <a
                        href="https://github.com/ShulkenH/schedule-generator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        GitHub 项目
                    </a>
                    <span className="text-gray-300">|</span>
                    <img
                        src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fshulkenh.github.io%2Fschedule-generator&count_bg=%23FF6B6B&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=%E8%AE%BF%E9%97%AE%E9%87%8F&edge_flat=false"
                        alt="访问量"
                        className="inline-block"
                        referrerPolicy="no-referrer-when-downgrade"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling && (e.target.previousSibling.style.display = 'none');
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
