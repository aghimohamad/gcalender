import React, { useLayoutEffect } from "react";

type OverFlowContainerProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  renderOverflow: (ammount : number) => React.ReactNode;
  className?: string;
  getKey: (item: T) => string;
};

function OverFlowContainer<T>({
  items,
  renderItem,
  getKey,
  renderOverflow,
  className,
}: OverFlowContainerProps<T>) {
    const [overflowAmount, setOverflowAmount] = React.useState(0)
    const containerRef = React.useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!containerRef.current) return

        const observer = new ResizeObserver((entries) => { 
            const container = entries[0].target as HTMLDivElement
            if (!container) return

            const children = container.querySelectorAll<HTMLElement>('[data-item]')
            const overflow = container.parentElement?.querySelector<HTMLDivElement>('[data-overflow]')
            if (overflow) 
                overflow?.style.setProperty('display', 'none')
            
            children.forEach((child) => {
                child?.style.removeProperty('display')
            })
                
            let overflowAmount = 0
            for (let i = children.length - 1; i >= 0; i--) { 
                const child = children[i] as HTMLDivElement
                if (container.scrollHeight <= container.clientHeight) {
                    break
                } 
                overflowAmount++
                child.style.display = 'none'
                overflow?.style.removeProperty('display')
            }
            setOverflowAmount(overflowAmount)


        })

        observer.observe(containerRef.current)

        return () => {
            observer.disconnect()
        }
    }
    , [items])


  return (
    <>
      <div className={className} ref={containerRef}>
        {items.map((item) => {
          return <div data-item key={getKey(item)}>{renderItem(item)}</div>;
        })}
      </div>
      <div data-overflow>{renderOverflow(overflowAmount)}</div>
    </>
  );
}

export default OverFlowContainer;
