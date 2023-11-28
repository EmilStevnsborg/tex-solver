import { useEffect, useState } from "react"

function GenerateMatrix(props) {

    //index where "-" appeared
    const [negativeIdx, setNegativeIdx] = useState([])
    
    const negativeInput = new RegExp("([0-9]|/)-|^(?!-[0-9])-")

    const fracInput = new RegExp("[1-9]/|")

    useEffect(() => {
        props.setTempMatrix(props.tempMatrix)
    }, [props.tempMatrix])

    return(
        <div className="table">
        <table>
        <tbody>
            {props.tempMatrix.map((array,i) => <tr key = {`row${i}`}>
                {array.map((e,j) => <td className = {j == array.length-1 ? "r_vec" : "std_vec"} key = {`e${i}${j}`}>
                    <input
                    value = {negativeIdx[0] == i && negativeIdx[1] == j ? "-" :props.tempMatrix[i][j]} 
                    onChange = {(event) => {
                        var val = event.target.value
                        if (negativeInput.test(val)) {
                            setNegativeIdx([i,j])
                        }
                        else {                            
                            let newGrid = props.tempMatrix.map(row => [...row])
                            if (fracInput.test(val)) {
                                newGrid[i][j] = val
                                props.setTempMatrix(newGrid)
                            }
                            if (!isNaN(Number(val))) {
                                newGrid[i][j] = Number(val)
                                props.setTempMatrix(newGrid)
                                setNegativeIdx([])
                            }
                        }
                        
                    }
                    }/>
                </td>)}
            </tr>)}
        </tbody>
        </table>
        </div>
    )
}

export default GenerateMatrix

