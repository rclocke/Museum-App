import React from "react";
import { useForm } from 'react-hook-form';
import { Form, Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useRouter } from 'next/router';
import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store";
import { addToHistory } from "../lib/userData";  

const AdvancedSearch = () =>{

  let [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  
  const router = useRouter();

    async function submitForm(data, e) {
      e.preventDefault();
        let queryString ='';
        queryString += `${data.searchBy}=true`;
        if(data.geoLocation != ''){
            queryString += `&geoLocation=${data.geoLocation}`
        }

        if(data.medium != ''){
            queryString += `&medium=${data.medium}`
        }

        queryString += `&isOnView=${data.isOnView}`
        queryString += `&isHighlight=${data.isHighlight}`
        queryString += `&q=${data.q}`

        
        setSearchHistory(await addToHistory(queryString)) 
        
        router.push(`/artwork?${queryString}`)

      }

      const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
          searchBy: 'title', 
          geoLocation:'',
          medium: '',
          isOnView: false,
          isHighlight: false,
          q: '',
        },
    });

    return(
        <>
        <Form onSubmit={handleSubmit(submitForm)}>
  <Row>
    <Col>
      <Form.Group className="mb-3">
        <Form.Label>Search Query</Form.Label>
        <Form.Control type="text" placeholder="" name="q" {...register("q",{ required: true})} className={errors.q && "form-control is-invalid"}/>
      </Form.Group>
    </Col>
  </Row>
  <Row>
    <Col md={4}>
      <Form.Label>Search By</Form.Label>
      <Form.Select name="searchBy" className="mb-3" {...register("searchBy")}>
        <option value="title">Title</option>
        <option value="tags">Tags</option>
        <option value="artistOrCulture">Artist or Culture</option>
      </Form.Select>
    </Col>
    <Col md={4}>
      <Form.Group className="mb-3">
        <Form.Label>Geo Location</Form.Label>
        <Form.Control type="text" placeholder="" name="geoLocation"  {...register("geoLocation")}/>
        <Form.Text className="text-muted">
        Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.), with multiple values separated by the | operator
      </Form.Text>
      </Form.Group>
    </Col>
    <Col md={4}>
      <Form.Group className="mb-3">
        <Form.Label>Medium</Form.Label>
        <Form.Control type="text" placeholder="" name="medium" {...register("medium")}/>
        <Form.Text className="text-muted">
        Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple values separated by the | operator
      </Form.Text>
      </Form.Group>
    </Col>
  </Row>
  <Row>
    <Col>
      <Form.Check
        type="checkbox"
        label="Highlighted"
        name="isHighlight"
        {...register("isHighlight")}
      />
      <Form.Check
        type="checkbox"
        label="Currently on View"
        name="isOnView"
        {...register("isOnView")}
      />
    </Col>
  </Row>
  <Row>
    <Col>
      <br />
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Col>
  </Row>
</Form>
        </>
    )
}

export default AdvancedSearch;