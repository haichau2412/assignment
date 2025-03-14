const Slider = () => {
  return <h1>Slider</h1>;
};

export default Slider;

export const BUILDER_ID = "slider";


export interface Config {
  type: typeof BUILDER_ID;
  fieldId: string;
  defaultValue?: string;
}
