import { GroupSchema, MandatoryFeeRule } from "../UI/schemaBuilder";

export interface FormConfig {
    step_id: string;
    config: GroupSchema[];
}

interface InsuredObject {
    object_id: string,
    steps: FormConfig[],
    feeCalucation: MandatoryFeeRule | null
}

export interface JSONSchema {
    productId: string;
    insuredObject: InsuredObject[];
    steps: FormConfig[];
}


export const createSchemaHelper = (data: JSONSchema) => {

    const { steps, insuredObject, productId } = data

    const getGeneralSteps = (viewMode?: boolean) => {
        const result = [{ id: 'insured_object' }, ...steps.map(({ step_id }) => ({
            id: step_id
        }))]
        if (!viewMode) {
            result.push({ id: 'done' })
        }
        return result
    }

    const getInsuredObjectConfig = (
        objectId: string,
    ) => {
        const object = insuredObject.find(({ object_id }) => object_id === objectId)

        if (object) {
            return object
        }
    }

    const getInsuredObjectProductList = () => {
        return insuredObject.map(({ object_id }) => ({
            id: object_id,
            content: object_id
        }))
    }


    const getInsuredObjectSteps = (
        objectId: string,
    ) => {
        const object = getInsuredObjectConfig(objectId)

        if (object) {
            return [...object.steps.map(({ step_id }) => ({ id: step_id }))]
        }
        return []
    }

    const getGeneralStepSchema = (
        stepId: string,
    ) => {
        return steps.find(({ step_id }) => step_id === stepId)?.config || []
    }

    const getInsuredStepSchema = (
        objectId: string,
        stepId: string,
    ) => {
        const object = getInsuredObjectConfig(objectId)

        return object?.steps.find(({ step_id }) => step_id === stepId)?.config || []
    }

    return {
        productId,
        getGeneralStepSchema,
        getInsuredStepSchema,
        getInsuredObjectSteps,
        getGeneralSteps,
        getInsuredObjectProductList
    }
}