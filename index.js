//

import {ng1xModule} from 'ng2in1';
import 'angular-touch';

import uiSliderComponent from './src/uiSlider';
import './index.css!';

export default uiSliderComponent;
export const uiSliderModule = ng1xModule(uiSliderComponent);

