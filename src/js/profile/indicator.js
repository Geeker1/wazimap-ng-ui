import {Chart} from './chart';
import {Observable, isNull, isEmptyString} from '../utils';

let indicatorClone = null;
let isLast = false;

const indicatorClass = '.profile-indicator';
const indicatorTitleClass = '.profile-indicator__title h4';
const chartDescClass = '.profile-indicator__chart_description p';
const sourceClass = '.data-source';

export class Indicator extends Observable {
    constructor(formattingConfig, wrapper, title, indicatorData, detail, _isLast) {
        super();
        this.groups = [];
        this.subindicators = indicatorData.subindicators;
        this.formattingConfig = formattingConfig;

        indicatorClone = $(indicatorClass)[0].cloneNode(true);

        isLast = _isLast;

        this.addIndicatorChart(wrapper, title, indicatorData, detail);
    }

    addIndicatorChart(wrapper, title, indicatorData, detail) {
        let indicator = indicatorClone.cloneNode(true);
        $(indicatorTitleClass, indicator).text(title);
        $(chartDescClass, indicator).text(indicatorData.description);
        const isLink = !isNull(indicatorData.metadata.url) && !isEmptyString(indicatorData.metadata.url);

        if (isLink) {
            let ele = $('<a></a>');
            $(ele).text(indicatorData.metadata.source);
            $(ele).attr('href', indicatorData.metadata.url);
            $(sourceClass, indicator).html(ele);
        } else {
            $(sourceClass, indicator).text(indicatorData.metadata.source);
        }

        if (indicatorData.groups !== null && typeof indicatorData.groups !== 'undefined') {
            for (const [group, items] of Object.entries(indicatorData.groups)) {
                this.groups.push(group);
            }
        }

        let c = new Chart(this.formattingConfig, this.subindicators, this.groups, detail, 'Percentage', indicator, title);
        this.bubbleEvents(c, [
            'profile.chart.saveAsPng', 'profile.chart.valueTypeChanged',
            'profile.chart.download_csv', 'profile.chart.download_excel', 'profile.chart.download_json', 'profile.chart.download_kml',
            'point_tray.subindicator_filter.filter'
        ]);

        if (!isLast) {
            $(indicator).removeClass('last');
        }

        wrapper.append(indicator);
    }
}
