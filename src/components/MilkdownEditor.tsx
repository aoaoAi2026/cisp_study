// WYSIWYG Markdown 编辑器 - 基于 Milkdown Crepe（所见即所得）
// 编辑器仅在 ready=true 时挂载；切换天数时通过 ready=false→true 自然重建
import React, { useRef } from 'react';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/nord-dark.css';
import './MilkdownEditor.css';

interface MilkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  ready?: boolean;
}

const MilkdownEditorInner: React.FC<{
  defaultValue: string;
  onChange: (markdown: string) => void;
}> = ({ defaultValue, onChange }) => {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue,
    });

    crepe.on((api) => {
      api.markdownUpdated((_ctx, markdown) => {
        onChangeRef.current(markdown);
      });
    });

    return crepe;
  }, []);

  return <Milkdown />;
};

const MilkdownEditor: React.FC<MilkdownEditorProps> = ({
  value,
  onChange,
  placeholder = '记录学习心得、疑问、重点…',
  ready = true,
}) => {
  if (!ready) {
    return (
      <div className="milkdown-skeleton">
        <div className="milkdown-skeleton-toolbar">
          <span /><span /><span /><span />
          <i /><span /><span /><span />
        </div>
        <div className="milkdown-skeleton-body">
          <div className="milkdown-skeleton-bar" />
          <div className="milkdown-skeleton-bar short" />
          <div className="milkdown-skeleton-bar" />
          <div className="milkdown-skeleton-bar shorter" />
          <div className="milkdown-skeleton-bar" />
          <div className="milkdown-skeleton-bar short" />
          <div className="milkdown-skeleton-bar shorter" />
        </div>
      </div>
    );
  }

  return (
    <div className="milkdown-cyber-wrapper">
      <MilkdownProvider>
        <MilkdownEditorInner
          defaultValue={value}
          onChange={onChange}
        />
      </MilkdownProvider>
    </div>
  );
};

export default MilkdownEditor;
