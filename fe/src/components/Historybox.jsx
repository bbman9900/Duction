import PreCaptionLabel from './Labels/PreCaptionLabel'
import PreSubTitleLabel from './Labels/PreSubTitleLabel'

import '@styles/components/HistoryBox.css'

export default function Historybox({ items, onClick }) {
  return (
    <div className='historybox'>
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => onClick(item.value)}
          className={`historybox_item ${index !== items.length - 1 ? 'withBorder' : ''}`}
        >
          <PreCaptionLabel text={item.title} style={{paddingBottom: "4px"}}/>
          <PreSubTitleLabel text={item.count} />
        </div>
      ))}
    </div>
  );
}
