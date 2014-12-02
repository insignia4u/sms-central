

//MAIN DOCUMENT READY SECTION
$(function(){


 	//re-render select dropdowns
 	$('select[name="longcode_class"]').select2("destroy");
	$('select[name="longcode_class"]').selectmenu("destroy");	
	$('select[name="longcode_class"]').selectmenu({style:'dropdown', maxHeight: 170});


	//frontend validation
	$('#form_save, #form_saveanother').on('click',function(e){

		
		if($(this).attr('id') == 'form_save')
		{
			$('#submit_type').val('save');
		}
		else
		{
			$('#submit_type').val('save_and_add');		
		}

		var has_error = 0;
	
        //validate	
		(function (){		
			//Account
			$('#account_validation_error').hide();
			var account = $('#billingitem_form input[name="billingitem_account"]').val();
			//is required
			if($.trim(account) == '')
			{
				$('#account_validation_error').find('div').text('Account is required.');
				$('#account_validation_error').show();
				has_error = 1;
				return; 
			}
		})();		
    
		//validate	
		(function (){		
			//name
			$('#name_validation_error').hide();
			var name = $('#billingitem_form input[name="billingitem_name"]').focus().val();		

			//name is required
			if($.trim(name) == '')
			{
				$('#name_validation_error').find('div').text('Name is required.');
				$('#name_validation_error').show();
				has_error = 1;
				return; 
			}
			
			if(has_error == 1)
			{
				return;
			}

		})();				
	
        //validate	
		(function (){		
			//setup cost
			$('#setupcost_validation_error').hide();
			var setupcost = $('#billingitem_form input[name="setupcost"]').focus().val();		
            setupcost = setupcost.replace(/\$/g,"");
            $('#billingitem_form input[name="setupcost"]').val(setupcost);
            
			//name is required
            if($('#billingitem_type').val() != 4){
                if($.trim(setupcost) == '')
                {
                    $('#setupcost_validation_error').find('div').text('Setup cost is required.');
                    $('#setupcost_validation_error').show();
                    has_error = 1;
                    return; 
                }
                if(/^[0-9]+(\.[0-9]{0,12})?$/g.test(setupcost) == false)
                {
        
                    $('#setupcost_validation_error').find('div').text('Setup cost is invalid.');
                    $('#setupcost_validation_error').show();
                    has_error = 1;
                    return;
                }	
                if(has_error == 1)
                {
                    return;
                }
            }

		})();

		//validate	
		(function (){		
			//quantity
			$('#quantity_validation_error').hide();
			var quantity = $('#billingitem_form input[name="billingitem_quantity"]').val();		
			//is required
			if($.trim(quantity) == '')
			{
				$('#quantity_validation_error').find('div').text('Quantity is required.');
				$('#quantity_validation_error').show();
				has_error = 1;
				return; 
			}
            if(/^[0-9]+(\.[0-9]{0,12})?$/g.test(quantity) == false)
			{
				$('#quantity_validation_error').find('div').text('Quantity is invalid.');
				$('#quantity_validation_error').show();
				has_error = 1;
				return;
			}	
		})();				
	
		//validate	
		(function (){		
			//unit price
			$('#unitprice_validation_error').hide();
			var unitprice = $('#billingitem_form input[name="billingitem_unitprice"]').focus().val();		
            unitprice = unitprice.replace(/\$/g,"");
            $('#billingitem_form input[name="billingitem_unitprice"]').val(unitprice);
            
			//is required
			if($.trim(unitprice) == '')
			{
				$('#unitprice_validation_error').find('div').text('Unit price is required.');
				$('#unitprice_validation_error').show();
				has_error = 1;
				return; 
			}
			if(/^[0-9]+(\.[0-9]{0,12})?$/g.test(unitprice) == false)
			{
	
				$('#unitprice_validation_error').find('div').text('Unit price is invalid.');
				$('#unitprice_validation_error').show();
				has_error = 1;
				return;
			}				
		})();

        //validate	
		(function (){		
			//startdate
			$('#startdate_validation_error').hide();
			var datefrom = $('#billingitem_form input[name="datefrom"]').val();	
            var timefrom = $('#billingitem_form input[name="timefrom"]').val();

			//is required
			if($.trim(datefrom) == '' || $.trim(timefrom) == '')
			{
				$('#startdate_validation_error').find('div').text('Start Date is required.');
				$('#startdate_validation_error').show();
				has_error = 1;
				return; 
			}			
		})();

		if(has_error ==  1)
		{ 
		  	e.preventDefault();
			return false;		
		}
		else
		{
			$('#billingitem_form').submit();
		}

	
	});

     

    var parent_tree = ''; 

    function load_parent_tree(){
        $('#parent_tree_loading').show();

        $.ajax({
            dataType: 'json',
            cache: false,
            url: '/account/get_parent_tree_ajax/',
            type: 'POST',
            success: function(msg){
                $('#parent_tree_loading').hide();
                parent_tree = msg;
                $("#select_accounts").select2('enable',true);
                $("#select_accounts").removeAttr('disabled');
                if(typeof(accounts) != 'undefined'){
                    $("#select_accounts").select2('val',accounts);
                }
                else{
                    var account = [$('#select_accounts').val()];
                    $("#select_accounts").select2('val',account);
                }
            }
        });
    }

    $("#select_accounts").select2({
            initSelection: function( element, callback ){
                var accounts = element.val().split(',');
                var data = [];
                $.each(parent_tree, function(index,tree_item){
                    if($.inArray(tree_item.id.toString(),accounts) > -1){
                        data.push({id: this.id, name: this.name});
                    }
                });
                if($("#select_accounts").prop('multiple')){
                    callback(data);
                }
                else{
                    callback(data[0]);
                }
            },
            multiple: $("#select_accounts").prop('multiple'),
            query: function(query){
                var data = {results:[]};
                var resultsize = 20, i=0;
                data.results = $.map(parent_tree, function(tree_item, idx){
                    if(tree_item.name.toLowerCase().indexOf(query.term.toLowerCase()) !== -1 && i<resultsize && tree_item.id >= 4){
                        i++;
                        return {id:tree_item.id, name:tree_item.name};
                    }
                });
                query.callback(data);
            },
            formatResult: dataFormatResult, // omitted for brevity, see the source of this page
            formatSelection: dataFormatSelection // omitted for brevity, see the source of this page
    });

    function dataFormatResult(data) {
        var markup = "<table class='movie-result'><tr>";
       
        markup += "<td class='data-info'><div class='data-title'>" + data.name + "</div>";
     
        markup += "</td></tr></table>"
        return markup;
    }

    function dataFormatSelection(data) {
        if(typeof(data) != 'undefined'){
            return data.name;
        }
    }

    load_parent_tree();

    
});