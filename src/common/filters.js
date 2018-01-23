import moment from 'moment';

let filters = function(VUE){
    VUE.filter('moment', function(val, format){
        if(val === null){
            return '--'
        }

        return moment(val).format(format);
    });

    VUE.filter('k2d', function(val, format){
        val = Number(val);

        return val.toFixed(2);
    })
};

export default filters;