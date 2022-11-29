import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store";
import { useRouter } from 'next/router';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button } from "react-bootstrap";
import styles from '../styles/History.module.css';
import { removeFromHistory } from "../lib/userData";  

const History = () =>{

    let [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    let parsedHistory = [];
    const router = useRouter();
    if(!searchHistory) return null;   
    
    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });
    
    const historyClicked = (e, index) =>{
        e.preventDefault(); 
        router.push(`/artwork?${searchHistory[index]}`)
    }

    async function removeHistoryClicked(e, index){
        e.stopPropagation(); 
        setSearchHistory(await removeFromHistory(searchHistory[index])) 

    }

    let count = 0;
    return(
        <>
        {parsedHistory.length > 0 ?
        <ListGroup>
        {parsedHistory.map(function(object, i){
            return (
                
            <ListGroup.Item key={i} as="div" action onClick={event => historyClicked(event, i)} className={styles.historyListItem}>
           {Object.keys(object).map(key => (<span key={count++}>{key}: <strong>{object[key]}</strong>&nbsp;</span>))}
           <Button className="float-end" variant="danger" size="sm" 
            onClick={e => removeHistoryClicked(e, i)}>&times;</Button>
            </ListGroup.Item>)
            
        })}
        </ListGroup> : <Card>
            <Card.Body>
                <Card.Text as="div">
                    <h4>Nothing Here</h4>Try searching for some artwork
                </Card.Text>
            </Card.Body>
        </Card>}
        </>
    )
}

export default History;