var view_all_selected_groups = [];

$(document).ready(function() {

    table_footer_showhide('table-1.grouplist');


	//show-table view-all-list

	$('.show-table.view-all-list').click(function(e){
		view_all_selected_groups = $.merge(view_all_selected_groups,$("#s2id_contactgroups").select2("val"));
		view_all_selected_groups = $.unique( view_all_selected_groups );

		$.ajax({
			type: "POST",
			url: '/contacts/getgrouplist',
			data:{ 
                "groupids":view_all_selected_groups
            },
            success:function(data) {      
            	data = JSON.parse(data);       
            	create_table_result(data);
			}
		});

		e.preventDefault();
	});

	$('.show-select.view-all-group').click(function(e){
		view_all_selected_groups = $.unique( view_all_selected_groups );
		
		$("#contactgroups").find('option').removeAttr('selected');
		$.each(view_all_selected_groups, function(index, selected_group) {

			$("#contactgroups").find('option:[value='+selected_group+']').attr('selected',1);
			$("#contactgroups").select2();
			
		});
		e.preventDefault();
	});

	
});

function create_table_result(data){
	html = '';
	htmlhead = '';
	htmlhead += '<tr>';
	htmlhead += '<th colspan="1"><a href="/contacts/getgrouplist/name/'+data.name_sort_order+'">Name</a></th>';
	htmlhead += '<th colspan="1"><a href="/contacts/getgrouplist/createdby/'+data.createdby_sort_order+'">Created by</a></th>';
	htmlhead += '<th colspan="1"><a href="/contacts/getgrouplist/contacts/'+data.contacts_sort_order+'">Totals Contact</a></th>';
	htmlhead += '<th colspan="1"><a href="/contacts/getgrouplist/lastmodified/'+data.lastmodified_sort_order+'">Last Modified</a></th>';
	htmlhead += '<th colspan="1"></th>';
	
	htmlhead += '<th class="last" colspan="1"></th>';
	htmlhead += '</tr>';
	
	//public function index($sort_by = 'name', $sort_order = 'asc',$limit=5, $offset = 0) {
	$('#table-1.grouplist table thead').html(htmlhead);

	$('#table-1.grouplist table thead a').click(function(e){
		resend_url(this.href);
		e.preventDefault();
	});

	htmlselectpage = '';
	htmlselectpage += '';
	
	pages = [5,10,20,50,100];
	$.each(pages, function(index,value){
		add_selected = '';
		if (data.limit == value)
			add_selected = ' selected="selected" ';
		htmlselectpage += '<option '+add_selected+' value="contacts/getgrouplist/'+data.sort_by+'/'+data.sort_order+'/'+value+'">'+value+' / page</option>';
	});
	

	$('#selectpage_group').selectmenu('destroy');
	$('#table-1.grouplist .selectpage ul select').html(htmlselectpage);
	//$('#selectpage_group').selectmenu({style:'dropdown', maxHeight: 170});
	$('#selectpage_group').select2();

	add_checked = '';
	if (data.contactgroups != undefined){
		c = 1;
		$.each(data.contactgroups, function(index, contactgroup) {
			html += '<tr class="item-'+c+' item">';
			html += '<td><a href="#">'+contactgroup.name+'</a></td>';


			html += '<td>'+contactgroup.createdby.firstname+' '+contactgroup.createdby.surname+', '+contactgroup.created+'</td>';
			html += '<td class="center">'+contactgroup.contacts+'</td>';

			modified_by_name = ''; 

			if (contactgroup.lastmodifiedby.firstname != undefined && contactgroup.lastmodifiedby.firstname != null){
				modified_by_name += contactgroup.lastmodifiedby.firstname;
			}

			if (contactgroup.lastmodifiedby.surname != undefined && contactgroup.lastmodifiedby.surname != null){
				modified_by_name += ' '+contactgroup.lastmodifiedby.surname;
			}
			modified_by_name_desc = '';
			if (modified_by_name != '')
				modified_by_name_desc = ', by '+ modified_by_name;

			html += '<td class="list">'+contactgroup.lastmodified+modified_by_name_desc+'</td>';
			
			add_checked = '';
			$.each(data.selected_groups, function(index, selected_group) {
				if (contactgroup.id == selected_group){
					add_checked = ' checked="checked" ';
					return;
				}
			});
			
			html += '<td><span class="custom-checkbox"><input type="checkbox" '+add_checked+' class="checkbox-'+c+'" value="'+contactgroup.id+'"><span class="box"><span class="tick"></span></span></span></td><td class="last"></td>';
			html += '</tr>';
			
			c++;
		});
	}

	$('#table-1.grouplist table tbody').html(html);

	$('#table-1.grouplist .pager .pagination').html(data.pagination);

	offset_desc = parseInt(data.offset) + 1;
	limit_desc = parseInt(data.limit) + parseInt(data.offset);
	showing_results_txt = 'Showing results '+offset_desc+' - '+limit_desc+' of '+data.totalgroups;
	$('#table-1.grouplist .footer .showresult').html(showing_results_txt);

	$('ul#selectpage_group-menu a').click(function(e){
		resend_url('/'+$('#selectpage_group').val());
		e.preventDefault();
	});


	$('#table-1.grouplist .pager .pagination a').click(function(e){
		resend_url(this.href);
		e.preventDefault();
	});

	$.getScript("/javascripts/table.js", function(data, textStatus, jqxhr) {
		$('#table-1.grouplist table .custom-checkbox input[type="checkbox"]').on('change', function() {
			table_footer_showhide('table-1.grouplist');
			
			if ($(this).is(":checked")){
				view_all_selected_groups.push($(this).val());
			}else{
				removeItem = $(this).val();
				view_all_selected_groups = $.grep(view_all_selected_groups, function(value) {
  					return value != removeItem;
				});

				$("#contactgroups").find('option:[value='+removeItem+']').removeAttr('selected');
				$("#contactgroups").select2();
			}
		});

		$("#table-1.grouplist .table-footer .select-all").click(function() {

			$('#table-1.grouplist table .custom-checkbox input[type="checkbox"]').each(function(index, value){
				view_all_selected_groups.push(value.value);
			});
		});

		$("#table-1.grouplist .table-footer .uncheck-all").click(function() {
			
			$('#table-1.grouplist table .custom-checkbox input[type="checkbox"]').each(function(index, value){
				removeItem = value.value;
				
				view_all_selected_groups = $.grep(view_all_selected_groups, function(value) {
  					return value != removeItem;
				});
			});

			$("#contactgroups").find('option:selected').removeAttr('selected');
			$.each(view_all_selected_groups, function(index, selected_group) {

				$("#contactgroups").find('option:[value='+selected_group+']').attr('selected',1);
				$("#contactgroups").select2();
				
			});
		});
    });

    table_footer_showhide('table-1.grouplist');
}

function resend_url(url){
	$.ajax({
		type : "POST",
		url  : url,
		data:{ 
			"groupids":view_all_selected_groups
		},
		success:function(data) {      
	    	data = JSON.parse(data);       
	    	create_table_result(data);
		}
	});
}

function table_footer_showhide(parent){
	count_checked_numbers = $('#'+parent+' table .custom-checkbox input[type="checkbox"]:checked').length;
    if (count_checked_numbers > 0){
        $('#'+parent+' .table-footer-2').show();
        $('#'+parent+' .table-footer-1').hide();

        $('#'+parent+' table .custom-checkbox input[type="checkbox"]:checked').each(function(){
        	$(this).parent().parent().parent().addClass('selected');
        })
    }else{
        $('#'+parent+' .table-footer-1').show();
        $('#'+parent+' .table-footer-2').hide();
    }
}
