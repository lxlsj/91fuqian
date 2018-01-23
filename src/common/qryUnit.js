import ajax from 'common/ajax.js';
import ajaxUrls from 'common/ajaxUrls.js';

export const qryChannelAll = () => {
    return ajax({
        method: 'get',
        url: ajaxUrls.channel.allList
    })
};
export const qryBusAll = (channelId = '') => {
    return ajax({
        method: 'get',
        url: ajaxUrls.business.allId,
        data: {
            channelId: channelId
        }
    })
};