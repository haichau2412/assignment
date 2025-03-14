const en = {
    term_general_info: 'General Information',
    label_package: 'Insurance Package',
    object_info: 'Insured Object Information',
    mandatory_benefit_text: 'Mandatory Insurance Benefits',
    additional_benefit_text: 'Additional Insurance Benefits',
    insured_object: 'Insured Object',

    // Insured Object Attribute
    buyer_info: 'Buyer Information',
    text_start_date: 'Start Date',
    text_end_date: 'End Date',
    text_name: 'Name',
    text_age: "Age",
    text_full_name: "Full name",
    text_gender: "Gender",
    text_place_of_issue: "Place of issue",
    text_relationship_to_buyer: "Relationship to the buyer",
    date_of_birth: "Date of Birth",
    date_of_issue: "Date of Issue",
    number_id_passport: "ID/Passport Number",
    text_relationship: 'Relationship',
    text_package: 'Package',
    order_text: "No.",
    text_address: 'Address',
    text_fee: 'Fee',

    insurance_amount: 'Insurance amount',
    benefit_1: 'Death and permanent total disability due to accident/year.',
    benefit_2: 'Death and permanent total disability due to disease/year.',
    benefit_3: 'Medical expense due to accidents/year',
    opt_benefit_1: 'Outpatient treatment/year',
    opt_benefit_2: 'Dental examination and treatment/year',

    object_id_human: 'Human',
    done: "Done"
}


export const getText = (key: string) => {
    return en[key as keyof typeof en] || key
}

export default en