'use client';

import dynamic from 'next/dynamic';

const CanvasStage = dynamic(() => import('./CanvasStage'), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-black flex items-center justify-center text-white">Loading Canvas...</div>
});

export default CanvasStage;
