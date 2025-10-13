import React, { useState } from 'react'
import { ResponsiveCirclePacking } from '@nivo/circle-packing'
import { useAppContext } from '../../context/AppContext'
import { index } from 'd3'

const CirclePackingLegend = ({ groups }) => (

  <div style={{
    display: 'flex',
    flexDirection: 'column',
    width: "auto",
    //marginRight: 16,
    fontSize: 'var(--font-size-button)',
    padding: '8px',
  }}>
    {groups.map(g => (
      <div key={g.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
        <span style={{
          width: 'var(--font-size-button)',
          height: 'var(--font-size-button)',
          borderRadius: '50%',
          background: g.color,
          marginRight: 5
        }} />
        {/*{g.id} - {g.value}kg*/}
        {g.id}
      </div>
    ))}
  </div>
)

/*const groups = data.children.map(g => ({
  id: g.id,
  color: g.color,
  total: g.children.reduce((sum, c) => sum + c.value, 0)
}))*/



/*function sumContaminantes(industrias, tipoRelease) {
  const sumas = {};

  Object.values(industrias).forEach(ind => {
    const release = ind.releases_by_pollutant?.[tipoRelease] || {}; //onsite u offsite

    //recorre pollutants en realease (onsite u offsite)
    Object.entries(release).forEach(([contaminante, valor]) => {
      sumas[contaminante] = (sumas[contaminante] || 0) + valor;
    });

  });
  return sumas;
}*/

function getCirclePackingData(data, colorMap, nameMap) {
  return {
    id: 'circle-treemap',
    color: "#d3d1ce", //parent circle color
    children: Object.entries(data).map(([id, value], idx) => ({
      id: nameMap[id] || id,
      value,
      color: colorMap[id] || "#cccccc",
      //name: nameMap[id] || id
    }))
  };
}

const MyCirclePacking = ({option, data}) => {
  const [zoomedId, setZoomedId] = useState(null)
  const { jsonData } = useAppContext()

  if (!data) return null;
  const colorMap = option?.colorMap || {};
  const nameMap = option?.nameMap || {};
  console.log("nameMap:", nameMap);

  const onsiteData = getCirclePackingData( data, colorMap, nameMap);
  console.log("onsiteData:", onsiteData);
  //const offsiteData = getCirclePackingData(industriasArray || [], "Off-site releases");


  return (
    <div style={{ display: 'flex', minHeight: '45dvh', width: '100%', flexDirection: 'column' }}>
     <p style={{ fontSize: 'var(--font-size-header)', textAlign: 'center', fontWeight: '700' }}>{option?.title || "Default Title"}</p>
      <div style={{ flex: '1 1 auto' }}>
        <ResponsiveCirclePacking
          data={onsiteData}
          padding={option.padding}
          margin={option.margin}
          colors={node => node.data.color}
          enableLabels={!!zoomedId}
          labelsFilter={e => zoomedId && e.node.height<1
          }
          label={node => zoomedId ? `${Math.round(node.value)} kg` : ''}
          valueFormat={v => `${Math.round(v)} kg`}
          zoomedId={zoomedId}
          motionConfig="slow"
          onClick={node => setZoomedId(zoomedId === node.id ? null : node.id)}
        />
      </div>
       {<CirclePackingLegend groups={onsiteData.children} />}
    </div>
  )
}

export default MyCirclePacking