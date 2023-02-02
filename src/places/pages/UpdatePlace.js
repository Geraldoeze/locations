import React, {useEffect, useState, useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import "./PlaceForm.css";

import { useHttpClient } from "../../shared/hooks/http-hooks";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, sendRequest, error, clearError} = useHttpClient();
    const [ loadedPlace, setLoadedPlace ] = useState(); 
    const placeId = useParams().placeId;
    const navigate = useNavigate();

    const [formState, inputHandler, setFormData ] = useForm({
        title: {
            value: "",
            isValid: false
        },
        description: {
            value: "",
            isValid: false
        }
    }, false);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL+`/places/${placeId}`);
                setLoadedPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                });
            } catch (err) {}
            
        };
        fetchPlace();
    }, [sendRequest, placeId, setFormData]);

    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        
        try {
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, 'PATCH', 
            JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value  
            }), {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
                
                }
            );     
            navigate('/' + auth.userId + '/places');
        } catch (err) {
            console.log(' Update Err, Venom')
        }
        
    }
 
    if(isLoading) {
        return <div className="center">
                  <LoadingSpinner />
                </div>
    }

    if(!loadedPlace && !error ) {
        return <div className="center">
                <Card>
                  <h2>Could not find place</h2>
                </Card>
                </div>
    }

   
    return ( 
        <React.Fragment>  
            <ErrorModal errbor={error} onClear={clearError} />            
        {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input 
               id="title"
               element="input"  
               type="text"
               label="Title"
               validators={[VALIDATOR_REQUIRE()]}
               errorText="PLease Enter a valid title."
               onInput={inputHandler}
               initialValue={loadedPlace.title}
               intialValid={true}
            />
              <Input 
               id="description"
               element="textarea"
               label="Description"  
               validators={[VALIDATOR_MINLENGTH(5)]}
               errorText="PLease Enter a valid description (min. 5 characters)."
               onInput={inputHandler}
               initialValue={loadedPlace.description}
               initialValid={true}
            />
            <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
        </form>
        )}
        </React.Fragment>
    );
}
 
export default UpdatePlace;