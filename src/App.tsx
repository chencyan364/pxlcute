/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MobilePreview,
  SCREEN_META,
  ScreenId,
  SimStateMode,
} from './components/MobilePreview';
import { SpecDocView, SpecTabId } from './components/SpecDocView';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [viewportWidth, setViewportWidth] = useState<412 | 360>(412);
  const [simState, setSimState] = useState<SimStateMode>('normal');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(false);
  const [activeSpecTab, setActiveSpecTab] = useState<SpecTabId>('decisions');

  const navItems: { id: SpecTabId; label: string }[] = [
    { id: 'decisions', label: '拍板与取舍' },
    { id: 'tokens', label: 'A. 设计 Token' },
    { id: 'components', label: 'B. 组件规格' },
    { id: 'screens', label: 'C&D. 逐屏与状态' },
    { id: 'motion', label: 'E&F. 动效与猫图' },
  ];

  return (
    <div className="min-h-screen bg-[#ebe6dc] text-[#3d3831] flex flex-col">
      {/* 3-Zone Top Bar Contract (暖感亚麻纸本风) */}
      <header className="sticky top-0 z-30 bg-[#f5f2eb]/95 backdrop-blur-md border-b border-[#dfd8ca] px-6 py-3.5 flex items-center justify-between gap-8">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveScreen('home');
          }}
          className="text-[17px] font-bold tracking-tight text-[#3d3831] whitespace-nowrap shrink-0"
        >
          小工作台 · 同日暖纸本设计系统
        </a>

        <nav className="hidden lg:flex items-center gap-6 text-[14px] font-medium text-[#6e665b]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSpecTab(item.id)}
              className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
                activeSpecTab === item.id
                  ? 'text-[#526040] font-semibold border-b-2 border-[#6f7d5c]'
                  : 'hover:text-[#3d3831]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() =>
              setActiveSpecTab((prev) => (prev === 'code' ? 'decisions' : 'code'))
            }
            className="px-4 py-2 text-[13px] font-semibold text-[#fcfbf7] bg-[#6f7d5c] rounded-[10px] hover:bg-[#5d6a4c] transition-colors whitespace-nowrap shrink-0"
          >
            {activeSpecTab === 'code' ? '返回规格书' : '查看落地 CSS 代码'}
          </button>
        </div>
      </header>

      {/* 主工作区 */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6">
        {/* 顶部 9 屏快速跳转与状态矩阵控制台 */}
        <section className="mb-6 bg-[#fcfbf7] rounded-2xl border border-[#e5dfd3] p-3.5 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* 9 屏切换胶囊栏 */}
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-[12px] font-semibold text-[#6e665b] mr-1">
                9 屏高保真切换：
              </span>
              {SCREEN_META.map((sc) => {
                const active = activeScreen === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setActiveScreen(sc.id)}
                    className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium transition-colors whitespace-nowrap shrink-0 border ${
                      active
                        ? 'bg-[#dce3d3] border-[#bfc9b2] text-[#4a573b] font-semibold'
                        : 'bg-[#f5f2eb] border-[#e5dfd3] text-[#6e665b] hover:text-[#3d3831]'
                    }`}
                  >
                    {sc.short}
                  </button>
                );
              })}
            </div>

            {/* 412px / 360px 宽度切换 + 标注尺规开关 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-0.5 bg-[#ebe6dc] rounded-[10px] border border-[#dfd8ca] text-[12px]">
                <button
                  onClick={() => setViewportWidth(412)}
                  className={`px-2.5 py-1 rounded-[8px] font-medium num-tabular whitespace-nowrap ${
                    viewportWidth === 412
                      ? 'bg-[#fcfbf7] text-[#526040] font-semibold shadow-xs'
                      : 'text-[#6e665b]'
                  }`}
                >
                  412px 主流宽
                </button>
                <button
                  onClick={() => setViewportWidth(360)}
                  className={`px-2.5 py-1 rounded-[8px] font-medium num-tabular whitespace-nowrap ${
                    viewportWidth === 360
                      ? 'bg-[#fcfbf7] text-[#526040] font-semibold shadow-xs'
                      : 'text-[#6e665b]'
                  }`}
                >
                  360px 极限窄屏
                </button>
              </div>

              <button
                onClick={() => setShowAnnotations((v) => !v)}
                className={`px-3 py-1.5 rounded-[10px] text-[12px] font-medium border whitespace-nowrap ${
                  showAnnotations
                    ? 'bg-[#3d3831] text-[#fcfbf7] border-[#3d3831]'
                    : 'bg-[#f5f2eb] text-[#6e665b] border-[#dfd8ca]'
                }`}
              >
                {showAnnotations ? '隐藏尺规标注' : '显示尺规标注'}
              </button>
            </div>
          </div>

          {/* 第二排：状态矩阵切换 */}
          <div className="pt-2.5 border-t border-[#e5dfd3] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-[12px] font-semibold text-[#6e665b] mr-1">
                状态矩阵 (D)：
              </span>
              {(
                [
                  { id: 'normal', label: '正常态' },
                  { id: 'empty', label: '空状态 (猫插画+引导)' },
                  { id: 'loading', label: '加载态 (正在打开…)' },
                  { id: 'offline', label: '离线态 (香港节点抖动)' },
                  { id: 'stress', label: '极限长文本 & +107738 金' },
                ] as { id: SimStateMode; label: string }[]
              ).map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSimState(st.id)}
                  className={`px-2.5 py-1 rounded-[8px] text-[12px] font-medium transition-colors whitespace-nowrap ${
                    simState === st.id
                      ? 'bg-[#efe6d5] text-[#9e473c] font-semibold border border-[#d6c5a9]'
                      : 'bg-[#f5f2eb] text-[#6e665b] border border-[#e5dfd3]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div className="flex lg:hidden items-center flex-wrap gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSpecTab(item.id)}
                  className={`px-2.5 py-1 rounded-[8px] text-[11.5px] font-medium ${
                    activeSpecTab === item.id
                      ? 'bg-[#6f7d5c] text-[#fcfbf7]'
                      : 'bg-[#ebe6dc] text-[#6e665b]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 左右分栏 */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-5 xl:sticky xl:top-20 flex flex-col items-center">
            <MobilePreview
              activeScreen={activeScreen}
              onSelectScreen={setActiveScreen}
              viewportWidth={viewportWidth}
              simState={simState}
              showAnnotations={showAnnotations}
            />
            <div className="mt-3 text-center text-[12px] text-[#6e665b]">
              提示：点击手机右上角雾蓝圆形单字头像（「明」）可切换成员视角；点击「全团 / • 小明 / • 阿璃」胶囊可过滤下方动态。
            </div>
          </div>

          <div className="xl:col-span-7">
            <SpecDocView
              activeSpecTab={activeSpecTab}
              onSelectScreen={setActiveScreen}
              onSelectSimState={setSimState}
              onSelectViewport={setViewportWidth}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
