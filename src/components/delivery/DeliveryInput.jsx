"use client"
import { useEffect, useState } from "react";
import Dropdown from "../utils/Dropdown";
import DeleteModal from "../utils/DeleteModal";

import { useForm } from 'react-hook-form';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { createDelivery, deleteDelivery, updateDeliveryService } from "@/services/deliveryService";

import { useDispatch, useSelector } from "react-redux";
import { setCurrentDelivery, setSelectedDelivery, setDeliveryModel, addNewDeliveryModel, updateDelivery } from "@/redux/features/deliverySlice";

const DeliveryInput = () => {
    const submissionTypes = {
        create: "create",
        update: "update"
    }

    //--------------------------------local states------------------------------//
    const [loading, setLoading] = useState(false);
    const [currentDeliveryDescription, setCurrentDeliveryDescription] = useState("");
    const [currentJiraLabel, setCurrentJiraLabel] = useState("");
    const [currentClient, setCurrentClient] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [submissionType, setSubmissionType] = useState(submissionTypes.create);


    //----------------------------------Global states from Redux-------------------------//
    const { clients, jiraLabels, currentDelivery, deliveryModels,resetDeliveryInputState } = useSelector((state) => state.delivery);
    const dispatch = useDispatch();


    //-------------------------schema valiadtion for craete delivery------------------------------//


    const schema = Joi.object({
        deliveryDescription: Joi.string().max(256).required().label("Delivery Description"),
        clientId: Joi.number().required().label("Client"),
        deliveryLabel: Joi.number().required().label("Jira Label")
    })

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: joiResolver(schema)
    });



    useEffect(() => {

        if (currentDelivery) {
            setValue("deliveryDescription", currentDelivery.deliveryDescription);
            setValue("clientId", currentDelivery.clientId);
            setValue("deliveryLabel", currentDelivery.deliveryLabel);


            setCurrentDeliveryDescription(currentDelivery.deliveryDescription);
            setCurrentJiraLabel(currentDelivery.jiraLabelDescription);
            setCurrentClient(currentDelivery.clientDescription);

        } else {

            setValue("deliveryDescription", "");
            setValue("clientId", "");
            setValue("deliveryLabel", "");

            setCurrentDeliveryDescription("");
            setCurrentJiraLabel("");
            setCurrentClient("");
        }


    }, [currentDelivery])

    //------------------------------creating new delivery------------------------//

    const handleCreateDelivery = async (data) => {

        //----------------------------create new delivery------------------------//
        if (submissionType == submissionTypes.create) {
            const postData = { ...data };

            const date = new Date();
            const formattedDate = date.toISOString().split('T')[0]; // DATE Foramt : YYYY-MM-DD

            postData.deliveryDate = formattedDate;



            const deliveryAssemblies = [];
            postData.deliveryAssemblies = deliveryAssemblies;

            setLoading(true);
            const newDelivery = await createDelivery(postData);

            const newDeliveryModel = { ...newDelivery };
            const jiraLabelDescription = jiraLabels.find(label => label.id == newDelivery.deliveryLabel).jiraLabel;
            newDeliveryModel.jiraLabelDescription = jiraLabelDescription;

            const clientDescription = clients.find(client => client.id == newDelivery.clientId).clientDescription;
            newDeliveryModel.clientDescription = clientDescription;

            dispatch(addNewDeliveryModel(newDeliveryModel));
            dispatch(setSelectedDelivery(newDeliveryModel));
            dispatch(setCurrentDelivery(newDeliveryModel));

            setLoading(false);
        }


        //-------------------update current delivery--------------//
        if (submissionType == submissionTypes.update) {
            const updateDeliveryModel = { ...data };
            //=====================CONFUSION: Should I replace with the latest date (the date when updating)===============//
            updateDeliveryModel.deliveryDate = currentDelivery.deliveryDate;
            updateDeliveryModel.deliveryId = currentDelivery.deliveryId;
            updateDeliveryModel.deliveryAssemblies = [...currentDelivery.deliveryAssemblies];

            setLoading(true);
            const updateDeliveryRes = await updateDeliveryService(updateDeliveryModel);

            const newUpdatedDelivery = { ...updateDeliveryModel };

            const jiraLabelDescription = jiraLabels.find(label => label.id == updateDeliveryRes.deliveryLabel).jiraLabel;
            newUpdatedDelivery.jiraLabelDescription = jiraLabelDescription;

            const clientDescription = clients.find(client => client.id == updateDeliveryRes.clientId).clientDescription;
            newUpdatedDelivery.clientDescription = clientDescription;

            dispatch(setCurrentDelivery(newUpdatedDelivery));
            dispatch(updateDelivery(newUpdatedDelivery));
            setLoading(false);
        }


    }

    //-----------------------Deleting current Delivery------------------------------//

    const handleDeleteDelivery = () => {
        setLoading(true);
        const deliveryToBeDeleted = currentDelivery.deliveryId;
        deleteDelivery(deliveryToBeDeleted);

        const updatedDeliveries = deliveryModels.filter(delivery => delivery.deliveryId != deliveryToBeDeleted);
        dispatch(setDeliveryModel(updatedDeliveries));
        dispatch(setCurrentDelivery(null));
        setLoading(false);
    }

    return (
        <>
            {currentDelivery && showDeleteModal && <DeleteModal label={currentDelivery.deliveryDescription}
                onDelete={handleDeleteDelivery}
                setShowModal={setShowDeleteModal}
            />}
            <div className="w-full flex items-center gap-3">
                <form className="flex gap-2 items-center" onSubmit={handleSubmit(handleCreateDelivery)}>
                    <div className="flex flex-col gap-2 mb-5">
                        <label htmlFor="delivery" className="text-lg font-medium">Delivery</label>
                        <input {...register("deliveryDescription")} value={currentDeliveryDescription} onChange={e => setCurrentDeliveryDescription(e.target.value)}
                            id="delivery" type="text" className="border border-gray-200 px-4 py-1 rounded-md focus:ring focus:ring-primary-500/50 focus:outline-none" placeholder="Delivery..." />
                        {errors.deliveryDescription && <p className="text-red-700 rounded-md mb-4">{errors.deliveryDescription.message}</p>}
                    </div>
                    <div className="flex flex-col">
                        <Dropdown data={clients} label={"Client"} sortBy={"clientDescription"} value={"id"} defaultValue={currentClient}
                            register={register} registerName={"clientId"} setValue={setValue} reset={resetDeliveryInputState}/>
                        {errors.clientId && <p className="text-red-700 rounded-md mb-4">{errors.clientId.message}</p>}
                    </div>
                    <div className="flex flex-col">
                        <Dropdown data={jiraLabels} label={"Jira labels"} sortBy={"jiraLabel"} value={"id"} defaultValue={currentJiraLabel}
                            register={register} registerName={"deliveryLabel"} setValue={setValue} reset={resetDeliveryInputState}/>
                        {errors.deliveryLabel && <p className="text-red-700 rounded-md mb-4">{errors.deliveryLabel.message}</p>}
                    </div>

                    {!currentDelivery && <button onClick={() => setSubmissionType(submissionTypes.create)} className="cta" disabled={loading}>{loading ? "Creating..." : "Create"}</button>}
                    {currentDelivery &&
                        <button onClick={() => setSubmissionType(submissionTypes.update)} className="cta" disabled={loading}>{loading ? "Updating..." : "Update"}</button>
                    }

                </form>
                {currentDelivery &&
                    <div className="flex gap-2">
                        <button className="cta bg-red-500" onClick={() => setShowDeleteModal(!showDeleteModal)}>{"Delete"}</button>
                    </div>
                }
            </div>
        </>
    )
}

export default DeliveryInput