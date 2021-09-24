import { LevelTableProps, StyledLevelTable } from './LevelTableTypes';
import { useTranslation } from 'react-i18next';

const LevelTable = (props: LevelTableProps) => {
  const {t} = useTranslation();
  console.log(props.data)
  function renderTableData() {
    
    return (
      <>
        {props.data.map((point: any, index: number) => {
          const {id, x, y} = point;
          return (
            <tr key={id}>
              <td className="data">{x}</td>
              <td className="data">{y}</td>
            </tr>
          )
        })}
      </>
    )
  }

  return (
    <StyledLevelTable>
      <div className="container">
        <table className="table">
          <tbody className="body">
            <tr>
              <td className="titles">{props.xData}</td>
              <td className="titles">{props.yData}</td>
            </tr>
            {renderTableData()}
          </tbody>
        </table>
      </div>
    </StyledLevelTable>
  )
}

export default LevelTable;