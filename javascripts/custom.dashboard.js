function table_footer_showhide()
{
	if ($('input[name=accounts]:checked').length > 0)
	{
		$('.table-footer > .table-footer-2').show();
		$('.table-footer > .table-footer-1').hide();
	}
	else
	{
		$('.table-footer > .table-footer-1').show();
		$('.table-footer > .table-footer-2').hide();
	}
}

jQuery(function($){
    $(document).unbind('ajaxStart');
    
    if ($('body').has('.graph_slider')) {
    	$.ajax({
			type: "POST",
			url: '/dashboard/sms_sent_chart',
			beforeSend:function(){
                $('.content.graph-slider').prepend(display_loading('Creating the chart...'));
                $('#dashboard_ajax_loading').show();
                $('.content.graph-slider').css('width', '100%');
            },
            success:function(data) {      
                $('#dashboard_ajax_loading').remove();
            	data = JSON.parse(data);   

				total_delivered_percentage = Math.round((data.total_delivered / data.total_sent) * 100);
				total_failed_percentage = Math.round((data.total_failed / data.total_sent) * 100);

                create_chart(total_delivered_percentage, total_failed_percentage);
			}
		});
    }

	$('input[name=accounts]').bind('change', table_footer_showhide);
});

function display_loading(message){
    var loading = null;
    if (message == undefined || message == '')
        message = 'Please Wait';
    loading = '<div id="dashboard_ajax_loading" style="display:none;width:70%; height:auto; margin:auto; background-image:none; text-align: center;padding-top:0;  "><img src="/images/loading-gif.gif" /></div>';

    return loading;
}
function create_chart(total_delivered_percentage, total_failed_percentage){
	// Init Graphs
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graph',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: false,
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage}%</b>',
            percentageDecimals: 1
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage * 100) / 100 +' %';
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'SMS activity',
            data: [
                ['Failed', total_failed_percentage],
                ['Delivered', total_delivered_percentage]
            ]
        }],
        colors: [
            '#ec5358',
            '#50b847'
        ],
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    });

   /* var chart2 = new Highcharts.Chart({
        chart: {
            renderTo: 'graph2',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: false,
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage}%</b>',
            percentageDecimals: 1
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'SMS activity',
            data: [
                ['Failed', 80],
                ['Delivered', 20]
            ]
        }],
        colors: [
            '#ec5358',
            '#50b847'
        ],
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    });

    var chart3 = new Highcharts.Chart({
        chart: {
            renderTo: 'graph3',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: false,
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage}%</b>',
            percentageDecimals: 1
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'SMS activity',
            data: [
                ['Failed', 50],
                ['Delivered', 50]
            ]
        }],
        colors: [
            '#ec5358',
            '#50b847'
        ],
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    });*/

    // Init Graph Slider
    $('.graph-slider').slides({
        preload: true
    });
}
