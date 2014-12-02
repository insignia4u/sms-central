//parent tree generation (parent dropdown)
var parent_tree = '';
if (typeof(edit_account_id) == 'undefined') edit_account_id = '';
//loading parent tree
function load_parent_tree(){
	$('#parent_tree_loading').show();
	$.ajax({
		dataType: 'json',
		cache: false,
		url: '/account/get_parent_level_tree_ajax/'+edit_account_id,
		success: function(msg){
			$('#parent_tree_loading').hide();
			parent_tree = msg;
			$("#account_parent").select2('enable',true);
			$("#account_parent").removeAttr('disabled');

			if(typeof(account_parent_post) == 'undefined'){
				var toplevel_parent = '';
				$.each(parent_tree, function(){
					if(toplevel_parent == ''){
						toplevel_parent = this;
					}
					else{
						if(this.level <= toplevel_parent.level && this.id < toplevel_parent.id){
							toplevel_parent = this;
						}
					}
				});
				account_parent_post = toplevel_parent.id;
			}
			if(account_parent_post < 4){
				account_parent_post = 4;
			}
			$("#account_parent").select2("val", account_parent_post);
			var url = $(location).attr('href');
			if(url.indexOf('account/edit') > 0){
				$('#account_parent').trigger('change',['parentloaded']);
			}
			else{
				$('#account_parent').trigger('change');
			}
		}
	});
}
//load_parent_tree();

// fix for < IE8
if(!Modernizr.csstransitions) {
	if($('#restriction').html() !== null){
		$('#restriction').html('<label>Restrict Purchases</label><input type="radio" name="account_restriction" value="on" checked="checked">On<input type="radio" name="account_restriction" value="">Off');
	}
};

function disableBillingModel(mode){
	$('#billingmodel').html('');
	$.each(billingmodel,function(index, value){
		var selected = '';
		if(mode == 'tiers' && value.id <= 3){
			if(typeof(packagetype) != 'undefined'){
				if(packagetype == value.id)
					selected = 'selected="selected"';
			}
			
			
			if(value.id == 1)
			{
				if($('#account_internationalbillingenable').is(':checked'))
				{
					value.text = "Package";
				}
				else
				{
					value.text = "Global Package";				
				}
			}
			
			if(!($('#account_internationalbillingenable').is(':checked') && value.id == 2))
			{
				$('#billingmodel').append('<option '+selected+' value="'+value.id+'">'+value.text+'</option>');			
			}
			
			

			
			// hide account to invoice
			$('#account_invoicingaccount').closest('div').hide();
		}
		if(mode == 'packages' && value.id >= 3){
			if(typeof(packagetype) === 'undefined' && value.id == 4){
				selected = 'selected="selected"';
			}
			else if(typeof(packagetype) != 'undefined'){
				if(packagetype == value.id)
					selected = 'selected="selected"';
			}

			if(value.id == 4)
			{
				if($('#account_internationalbillingenable').is(':checked'))
				{
					value.text = "Tier";
				}
				else
				{
					value.text = "Global Tier";				
				}
			}


			if(!($('#account_internationalbillingenable').is(':checked') && value.id == 5))
			{
				$('#billingmodel').append('<option '+selected+' value="'+value.id+'">'+value.text+'</option>');
			}


			// show account to invoice
			$('#account_invoicingaccount').closest('div').show();
		}
	});
	//packagetype = undefined;
	$('#billingmodel').selectmenu('destroy');
	$('#billingmodel').selectmenu({
		style: 'dropdown'
	});
	$('#billingmodel').trigger('change');
	if(!$('#billingmodel').closest('div.row').is(":visible")){
		hideCustomBillingModel();
	}
}

function update_footer(table_id){
	if($('#'+table_id+' .custom-checkbox input:checked').size() > 0){
		$('#'+table_id+' .table-footer-1').css('display','none');
		$('#'+table_id+' .table-footer-2').css('display','block');
	}
	else{
		$('#'+table_id+' .table-footer-1').css('display','block');
		$('#'+table_id+' .table-footer-2').css('display','none');
	}
}

function hideCustomBillingModel(){
	$('#flatrate-package').hide();
	$('#custom-packages').hide();
	$('#custom-tier').hide();
}

// filter out account < 4
$.each(parent_tree, function(index, item){
	if(typeof(item) !== 'undefined'){
		if(item.id < 4){	
			parent_tree.splice(index,1);
		}
	}
});

$("#account_parent").select2({
	placeholder: 'Select Parent Account',
	query: function(query){
		var data = {results:[]};
		var resultsize = 20, i=0;
		data.results = $.map(parent_tree, function(tree_item, idx){
			if(tree_item.name.toLowerCase().indexOf(query.term.toLowerCase()) !== -1 && i<resultsize && tree_item.id >= 4){
				i++;
				var level = '';
				for(var j = 0; j< tree_item.level; j++){
					level += '-';
				}
				return {id:tree_item.id, text:level+tree_item.name};
			}
		});
		query.callback(data);
	},
	initSelection: function( element, callback ){
		var data = [];
		var account = $.grep(parent_tree, function(tree_item){
			return tree_item.id == element.val();
		});
		$.each(account,function(){	
			data.push({id: this.id, text: this.name});
		});
		callback(data[0]);
	}
});

var prepaid_parent = null;
var is_reseller = false;

$("#account_parent").on("change",function(e,triggerpoint){
//	var show_package_section = true;
	var account_id = $(this).val();
	var account = $.grep(parent_tree, function(tree_item){
		return tree_item.id == account_id;
	});
    is_reseller = false;
    if(typeof(account[0] != 'undefined')){
        if(account[0].accounttype == 4){
            is_reseller = true;
        }
    }
	if(account_id == 4 || is_reseller){
		$('#billingmodel').closest('div').show();
		$('#internationalbilling_panel').show();
	}
	else{
		$('#billingmodel').closest('div').hide();
			$('#internationalbilling_panel').hide();

		$('#flatrate-package').hide();
		$('#custom-packages').hide();
		$('#custom-tier').hide();
	}
    
	if(account[0] != undefined){
		// disable payment model if parent is post-paid account
		if(account[0].paymentmodel == 2 && account_id != 4 && $('#billingmodel').length > 0 && !is_reseller){
			//$('#billingmodel').closest('div').hide();
			//$('#internationalbilling_panel').hide();

		//	show_package_section = false;
		}
		// disable payment model if parent is pre-paid account , show billingmodel if current account is postpaid
		else if(account[0].paymentmodel == 1 && account_id != 4 && $('#billingmodel').length > 0 && !is_reseller)
		{
			$('#billingmodel').closest('div').hide();
			$('#internationalbilling_panel').hide();
		
			//show_package_section = false;
		}
		else{
			$('#billingmodel').closest('div').show();
			$('#internationalbilling_panel').show();
		}

		var default_invoicing_account = account[0].default_invoicing_account == undefined? 1:account[0].default_invoicing_account;
		// force invoicing account to created account
		if(account_id == 4 || account[0].accounttype == ACCOUNT_TYPE_RESELLER){
			default_invoicing_account = 2;
			$('#account_invoicingaccount').selectmenu('disable');
		}
		else{
			$('#account_invoicingaccount').selectmenu('enable');
		}
		// pre-set the default values
		if(triggerpoint != 'parentloaded'){
			var default_volume_limit = account[0].default_volume_limit == undefined? '':account[0].default_volume_limit;
			var default_payment_model = account[0].default_payment_model;
			var default_source_option = account[0].default_source_option == undefined? 3:account[0].default_source_option;

                    // set default payment model to postpaid if parent's account type is not reseller and payment model is postpaid
                    if (typeof(account[0].default_payment_model) == 'undefined') {
                        if (account[0].accounttype != ACCOUNT_TYPE_RESELLER && account[0].paymentmodel == 2 && account[0].id > 4) {
                            default_payment_model = account[0].paymentmodel;
                        }
                    }

			$('#account_invoicingaccount').selectmenu("value",default_invoicing_account-1);
			
			$('input[name=account_limitmonthlyvolume]').val(default_volume_limit);
			
			$('#account_paymentmodel').selectmenu("value",default_payment_model-1);

			if($('#source').length > 0){
				$('#source').selectmenu("value",default_source_option-1);
				$('#source').selectmenu('change');
			}
			$('#account_paymentmodel').trigger('change');
			$('#billingmodel').trigger('change');
		}
		
		prepaid_parent = false;
        if(account[0].accounttype == 4){
            $('#account_paymentmodel').selectmenu('enable');
        }
		else if (account[0].paymentmodel == 2 && account[0].id > 4)
		{
			//selectmenu_change('account_paymentmodel', 2);
			$('#account_paymentmodel').selectmenu('enable');
		}
		// allow postpaid child in prepaid parent 
		else if (account[0].paymentmodel == 1 && account[0].id > 4)
		{
			prepaid_parent = true;
			$('#account_paymentmodel').selectmenu('enable');
			//selectmenu_change('account_paymentmodel', 1);
			//$('#account_paymentmodel').selectmenu('disable');
		}
		else{
			$('#account_paymentmodel').selectmenu('enable');
		}
		
		if(account_id > 4)
		{
			$('#account_internationalbillingenable').removeAttr('checked');	
			$('#account_internationalbillingenable').trigger('change');
		}
		
				$('#billing_div_id').show();

		$.ajax({
			type: 'GET',
			dataType: 'json',
			cache: false,
			url: '/account/get_top_parent/'+account[0].id,
			success:function(data) {

                            parent_postpaid_partner = data.postpaid_partner_child;
				parent_accounttype = data.accounttype;
				if (typeof(data.accounttype) == 'undefined') 
				{
				
	                $('#billingmodel').trigger('change');                
	                $('#account_paymentmodel').trigger('change');
					return;
				}
				if (data.accounttype == ACCOUNT_TYPE_RESELLER && typeof(data.account_reseller) != 'undefined')
				{
                    if(override_reseller_child_values){
					// set child settings
                if(data.account_reseller.packagetype == null){
                    data.account_reseller.packagetype = 1;
                        }

						// populate default custom package
                        if(data.account_reseller.packagetype == 2){
                                $('#table-1 tbody').html('');
                                for(var p in data.account_reseller.packages){
                                        add_custom_package_row(data.account_reseller.packages[p].includedsms, data.account_reseller.packages[p].price);
                                }
                        }
                        // populate default flat rate package
                        if(data.account_reseller.packagetype == 3){
                                $('input[name=flatrate_price]').val(data.account_reseller.packages[0].price);
                        }	

                        selectmenu_change('billingmodel', data.account_reseller.packagetype);
                        $('input[name=account_expirymonths]').val(data.account_reseller.expirymonths);
                    }
					// only allow pre-paid accounts
/*
                    if($('#account_paymentmodel').val() != 1){
                        selectmenu_change('account_paymentmodel', 1); // 1 = PREPAID
                    }
*/
					//$('#account_paymentmodel').selectmenu('disable');
					//$('#billing_div_id').hide();
				}
				//if parent is postpaid and child is post paid and add account page
				else if(typeof(data.postpaid_packages) != 'undefined' && $('#account_paymentmodel').val() == 2)
				{
				
					if(data.postpaid_packages.length > 0)
					{

						//populate postpaid
						if(data.postpaid_packages[0].packagetype == 5 && (edit_account_id == '' || $.trim($('#table-2 tbody').html()) == ''))
						{
							$('#table-2 tbody').html('');
                            $.each(data.postpaid_packages, function(index, value) {
								$('#table-2 tbody').append(' \
									<tr class="datarow item-'+index+'"> \
											<td></td> \
											<td class="center tier-from">'+value.includedmms+'</td> \
											<td class="center tier-to">'+value.includedsms+'</td> \
											<td class="center tier-price">'+value.price+'</td> \
											<td class="tcheck"><span class="custom-checkbox"><input type="checkbox" class="checkbox-'+value.id+'" name="checkbox"><span class="box"><span class="tick"></span></span></span></td> \
											<td></td> \
									</tr> \
								');
			
								$('.checkbox-'+value.id).on('change',function(){
									if($(this).attr('checked') == 'checked') {
										$(this).closest('tr').addClass("selected");
									}
									else{
										$(this).closest('tr').removeClass("selected");
									}
									update_footer($(this).closest('.table-box').attr('id'));
								});
							});
							updateTierUI();       
						}
						
						if(data.postpaid_packages[0].packagetype == 3 && (edit_account_id == '' ||  ($.trim($('input[name=flatrate_price]').val()) == 0.15 && $('input[name=flatrate_gst_setting]:checked').val())))
						{
 	                        $('input[name=flatrate_price]').val(data.postpaid_packages[0].price);
							$('input[name=flatrate_gst_setting][value='+data.postpaid_packages[0].gstsetting+']').prop('checked', true);
 	                        
						}
						
						if($('#billingmodel').val() != 3 &&  $('#billingmodel').val() != 5)
						{
							packagetype = data.postpaid_packages[0].packagetype;						
						}

		
					}	
				}
                
                // EX-687
                if(typeof(account[0].accounttype) != 'undefined'){
                    if(account[0].accounttype == ACCOUNT_TYPE_RESELLER){ 
                        $('#billingmodel').closest('div').show();
                        $('#internationalbilling_panel').show();

                    }
/*
                    if($('#account_paymentmodel').val() != 1){
                        selectmenu_change('account_paymentmodel', 1); // 1 = PREPAID
                    }
*/
                }
                
                //if(show_package_section == true)
                if (!is_reseller) {
	                $('#billingmodel').trigger('change');                
	                $('#account_paymentmodel').trigger('change');
                }
                
			}
		});

	}
});

$('#source,#account_paymentmodel,#account_invoicingaccount,#reseller_default_billing_model,#reseller_revenue_share_model').selectmenu({
	style: 'dropdown'
});


$('#source').on('change',function(e){
	if($(this).val() == 2){
		$('#accountvalidsource_tagsinput').show();
	}
	else{
		$('#accountvalidsource_tagsinput').hide();
	}
});

$('#accountvalidsource').tagsInput({
	width:'auto',
	defaultText:''
});

if($('#accountvalidsource').data('tags') != undefined){
	$('#accountvalidsource').importTags($('#accountvalidsource').data('tags'));
}

if($('#accountvalidsource').data('selected') !== ''){
	$('#source').trigger('change');
}

var billingmodel = [];

$('#billingmodel option').each(function(){
	billingmodel.push({id:$(this).val(),text:$(this).text()});
});

$('#account_paymentmodel').on('change',function(e){
    hideCustomBillingModel();
    if ($(this).val() == 1) {
        // disable tiers
        disableBillingModel('tiers');

        //dont show custombilling if parent is prepaid and current account is prepaid
        if (!prepaid_parent) {
            $('#billingmodel').closest('div').show();
            $('#internationalbilling_panel').show();
            if (!is_reseller && $('#account_parent').val() > 4) {
                hideCustomBillingModel();
                $('#billingmodel').closest('div').hide();
                $('#internationalbilling_panel').hide();
            }
        } else {
            hideCustomBillingModel();
            $('#billingmodel').closest('div').hide();
            $('#internationalbilling_panel').hide();
        }

        if (typeof(parent_postpaid_partner) != 'undefined' && parent_postpaid_partner) {
            // ex-799: pre-paid child account will have an 'invoicing account' set to the parent (hard coded).
            $('#account_invoicingaccount').selectmenu("value", 1);
            $('#account_invoicingaccount').closest('div').hide();
        }
    }
    else if ($(this).val() == 2) {
        // disable packages
        disableBillingModel('packages');		
        if (prepaid_parent) {
            // if(parent_accounttype > 1){
            $('#billingmodel').closest('div').hide();
            hideCustomBillingModel();
            // }
            $('#account_invoicingaccount').closest('div').hide();
            $('#internationalbilling_panel').hide();
        } else {
            $('#billingmodel').closest('div').show();	
            $('#internationalbilling_panel').show();
            $('#account_invoicingaccount').closest('div').show();
        }
    }

    if ($('#account_parent').val() > 4) {
        $('#internationalbilling_panel').hide();	
    }
});

$('#billingmodel').on('change',function(){
	hideCustomBillingModel();
	if($(this).val() == 2){
		$('#custom-packages').show();
	}
	if($(this).val() == 3 && !$('#account_internationalbillingenable').is(':checked')){
		$('#flatrate-package').show();
	}
	if($(this).val() == 5){
		$('#custom-tier').show();
	}
});

var billingModelModified = false;
var resellerBillingModelModified = false;

//international billing
$('#account_internationalbillingenable').on('change',function(){
	if($('#account_internationalbillingenable').is(':checked'))
	{
		$('#internationalbilling_div_id').show();
		$('#billingmodel option[value="1"]').val()
		$('#billingmodel option[value="4"]')
		//Global Tier to Tier, Global Package to Package
		
	}
	else
	{
		//Tier to Global Tier, Package to Global Package
		
			
		$('#internationalbilling_div_id').hide();		
	}
	billingModelModified = true;
	
	$('#account_paymentmodel').trigger('change');
});


$('#account_internationalbillingenable').trigger('change');


$('button#add,button#save,button#addOther').on('click',function(){

	$('div.validate-info').each(function(){
		$(this).hide();
	});


	var error = false;
	
	//international billing validation
	if($('#account_internationalbillingenable').is(':checked'))
	{
		if(!$('#assign_countries').select2("val").toString())	
		{
			$('#assign_countries_Info').find('div').text('Please select at least one country.');
			$('#assign_countries_Info').css('display','inline-block');
			$('html, body').animate({scrollTop:0}, 'fast');
				error = true;				
		}
	}
	
	
	if($(this).attr('id') == 'addOther'){
		$('input[name=addAnother]').val(1);
	}
	// resave old billingmodels
	if(typeof(account_billingmodel_id) != 'undefined' && account_billingmodel_id > 5){
		billingModelModified = true;
	}
	
	
	if($('#billingmodel').val() == 2 && billingModelModified){
		var data = [];
		$('#table-1 table tr.datarow').each(function(){
			var includedsms = $(this).find('td:nth-child(2)').text();
			var price = $(this).find('td:nth-child(3)').text();
			if(includedsms != '' & price !=''){
				data.push({
					'custom_includedsms' : includedsms,
					'custom_price' : price
				});
			}
		});
		
	}


	if($('#billingmodel').val() == 2) {
		//do not allow no row
		if($('#table-1 table tr.datarow').length ==0)
		{
			$('#table-1 #ui-package-add').find('input:nth-child(1)').addClass('input-notvalid');
			$('#table-1 #ui-package-add').find('input:nth-child(2)').addClass('input-notvalid');

			$('#package_validate_Info').find('div').text('Please set at least one package and click "Add a New Custom Package" link below.');
			$('#package_validate_Info').css('display','inline-block');
			$('html, body').animate({scrollTop:0}, 'fast');
							
				error = true;	
		}			
	
	}



	if($('#billingmodel').val() == 5 && billingModelModified){
		var data = [];
		$('#table-2 table tr.datarow').each(function(){
			var from = $(this).find('td:nth-child(2)').text();
			var to = $(this).find('td:nth-child(3)').text();
			var price = $(this).find('td:nth-child(4)').text();
			
			if(to == '' || price == ''){
				error = true;
			}
		
			if(from && to && price){
				data.push({
					'custom_tier_from' : from,
					'custom_tier_to' : to,
					'custom_tier_price' : price
				});
			}
		});
		

		
		
	}
	
	
	if($('#billingmodel').val() == 5) {
		//do not allow no row
		if($('#table-2 table tr.datarow').length ==0)
		{
			$('#table-2 #ui-tier-add').find('input:nth-child(1)').addClass('input-notvalid');
			$('#table-2 #ui-tier-add').find('input:nth-child(2)').addClass('input-notvalid');
			$('#table-2 #ui-tier-add').find('input:nth-child(3)').addClass('input-notvalid');

			$('#tier_validate_Info').find('div').text('Please set at least one tier and click "Apply the above tier..." link below.');
			$('#tier_validate_Info').css('display','inline-block');
			$('html, body').animate({scrollTop:0}, 'fast');
							
				error = true;	
		}			
	
	}
	
	$('#custom-package-field').val(JSON.stringify(data));

	// pre-validation
	var monthly_limit = $.trim($('input[name=account_limitmonthlyvolume]').val());
	var credit_expiry = $.trim($('input[name=account_expirymonths]').val());
	var accountname = $.trim($('input[name=account_name]').focus().val());
	$('input[name=account_name]').blur();
	
	
	if(monthly_limit != 'Monthly Volume Limit' && monthly_limit != ''){
		if( !/^\d+$/.test(monthly_limit)) {
			$('#monthly_volume_Info').find('div').text('Only positive integers allowed');
			$('#monthly_volume_Info').css('display','inline-block');
			$('html, body').animate({scrollTop:0}, 'fast');
			error = true;
		}
	}

	if(credit_expiry != undefined && credit_expiry !=''){
		if( !/^\d+$/.test(credit_expiry)){
			$('#credit_expiry_Info').find('div').text('Only positive integers allowed');
			$('#credit_expiry_Info').css('display','inline-block');
			error = true;
		}
	}
	if(accountname == ''){
		$('#accountname_Info').find('div').text('Account Name Field required');
		$('#accountname_Info').css('display','inline-block');
		error = true;
	}

	if ($('select[name=account_accounttype]').length > 0 && $('select[name=account_accounttype]').val() == ACCOUNT_TYPE_RESELLER)
	{
		var reseller_credit_expiry = $.trim($('input[name=reseller_credit_expires_in]').val());
		if (reseller_credit_expiry != undefined && reseller_credit_expiry != '' && !/^\d+$/.test(reseller_credit_expiry))
		{
			$('#reseller_credit_expiry_Info').find('div').text('Only positive integers allowed');
			$('#reseller_credit_expiry_Info').css('display','inline-block');
			error = true;
		}

		var account_alias = $.trim($('input[name=account_alias]').val());
		var alias_msg = null;
		if (account_alias == '' || account_alias == 'Account Alias Name')
		{
			alias_msg = 'Account Alias Name Field required';
		}
		else if (!/^[a-z0-9]+$/i.test(account_alias))
		{
			alias_msg = 'Only alphanumeric characters are allowed';
		}
		if (alias_msg)
		{
			$('#account_alias_Info').find('div').text(alias_msg);
			$('#account_alias_Info').css('display','inline-block');
			error = true;
		}

		var revenue_model = $('#reseller_revenue_share_model').val();
		var revenue_share = $.trim($('input[name=reseller_revenue_share_'+revenue_model+']').val());
		var revenue_msg = null;
		if (revenue_share == undefined || revenue_share == '')
		{
			revenue_msg = 'Revenue Share Field required';
		}
		else if (!/^\d+(\.\d+)?$/.test(revenue_share))
		{
			revenue_msg = 'Only positive decimal allowed';
		}
		if (revenue_msg)
		{
			$('#reseller_revenue_share_Info').find('div').text(revenue_msg);
			$('#reseller_revenue_share_Info').css('display','inline-block');
			error = true;
		}
		else
		{
			$('input[name=reseller_revenue_share]').val(revenue_share);
		}

		// 2 = CUSTOM_PACKAGE
		if ($('#reseller_default_billing_model').val() == '2' && resellerBillingModelModified)
		{
			var data = new Array();
			$('#reseller-table-1 table tr.datarow').each(function(){
				var includedsms = $(this).find('td:nth-child(2)').text();
				var price = $(this).find('td:nth-child(3)').text();
				if(includedsms != '' & price !=''){
					data.push({
						'custom_includedsms' : includedsms,
						'custom_price' : price
					});
				}
			});
			$('#custom_reseller_packages').val(JSON.stringify(data));
		}


		if ($('#reseller_default_billing_model').val() == '2')
		{
			//do not allow no row
			if($('#reseller-table-1 table tr.datarow').length ==0)
			{
				$('#reseller-table-1 #ui-reseller-package-add').find('input:nth-child(1)').addClass('input-notvalid');
				$('#reseller-table-1 #ui-reseller-package-add').find('input:nth-child(2)').addClass('input-notvalid');
	
				$('#reseller_package_validate_Info').find('div').text('Please set at least one package and click "Add a New Custom Package" link below.');
				$('#reseller_package_validate_Info').css('display','inline-block');
				$('html, body').animate({scrollTop:0}, 'fast');
								
					error = true;	
			}			
			
		
		}




		if ($('#reseller_default_billing_model').val() == 3) // Flat Rate
		{
			var reseller_flatrate_price = $('input[name=reseller_flatrate_price]').val();
			if ((reseller_flatrate_price == undefined || reseller_flatrate_price == '' || reseller_flatrate_price == '0') || (!/^\d+(\.\d+)?$/.test(reseller_flatrate_price)))
			{
				$('#reseller_flatrate_price_Info').find('div').text('Cannot set no charge per SMS for flat-rate price. Please set a valid flat-rate price.');
				$('#reseller_flatrate_price_Info').css('display','inline-block');
				error = true;
			}
		}
	}

	if ($('#billingmodel').val() == 3) // Flat Rate
	{
		var flatrate_price = $('input[name=flatrate_price]').val();
		if ((flatrate_price == undefined || flatrate_price == '' || flatrate_price == '0') || (!/^\d+(\.\d+)?$/.test(flatrate_price)))
		{
			$('#flatrate_price_Info').find('div').text('Cannot set no charge per SMS for flat-rate price. Please set a valid flat-rate price.');
			$('#flatrate_price_Info').css('display','inline-block');
			error = true;
		}
	}

	if(!error){
		$('#addAccountForm').submit();
	}
	else{
		$('html, body').animate({scrollTop:0}, 'fast');
	}
});

$('#package-add, #reseller-package-add').on('click', function(){
	var includedSMS = $(this).parent().parent().prev().find('input:nth-child(1)').removeClass('input-notvalid').val();
	var price = $(this).parent().parent().prev().find('input:nth-child(2)').removeClass('input-notvalid').val();
	var error = false;
	if( !/^\d+$/.test(includedSMS)) {
		$(this).parent().parent().prev().find('input:nth-child(1)').addClass('input-notvalid');
		error = true;
	}
	if( !/^(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(price) || price=='') {
		$(this).parent().parent().prev().find('input:nth-child(2)').addClass('input-notvalid');
		error = true;
	}
    // EX-811 package price must not less than $24 
    if(price / includedSMS < 0.04 || price / includedSMS > 0.3) {
        $(this).parent().parent().prev().find('input:nth-child(2)').addClass('input-notvalid');
        $(this).parent().parent().prev().find('.validate-info').find('div').text('The price per SMS must be greater than $0.04 and less than $0.3');
        $(this).parent().parent().prev().find('.validate-info').css('display','inline-block');
        error = true;
    }

    if(price < 24) {
        $(this).parent().parent().prev().find('input:nth-child(2)').addClass('input-notvalid');
        $(this).parent().parent().prev().find('.validate-info').find('div').text('The minimum package price allowed is $24.');
        $(this).parent().parent().prev().find('.validate-info').css('display','inline-block');
        error = true;
    }

	if(!error){
		var div_id = ($(this).attr('data-bb-act') && $(this).attr('data-bb-act').length > 0)? $(this).attr('data-bb-act') : 'table-1';
		var id=$('#'+div_id+' tr').length;
		var newrow = $('<tr></tr>').addClass('datarow item-'+id);
		newrow.append($('<td></td>'));
		newrow.append($('<td></td>').addClass('center').text(includedSMS));
		newrow.append($('<td></td>').addClass('center').text(price));
		var checkbox = $('<span></span>').addClass('custom-checkbox').html('<input type="checkbox" class="checkbox-'+id+'" name="checkbox"><span class="box"><span class="tick"></span></span>');
		checkbox.find('input').on('change',function(){
			if($(this).attr('checked') == 'checked') {
				$(this).closest('tr').addClass("selected");
			}
			else{
				$(this).closest('tr').removeClass("selected");
			}
			update_footer($(this).closest('.table-box').attr('id'));
		});
		newrow.append($('<td></td>').addClass('tcheck').append(checkbox));
		newrow.append($('<td></td>'));
		
		$('#'+div_id).find('table tbody').append(newrow);
		
		if (div_id != 'table-1')
		{
			resellerBillingModelModified = true;
		}
		else
		{
			billingModelModified = true;
		}
	}
});

function add_custom_package_row(includedSMS, price){
        var div_id = 'table-1';
        var id=$('#'+div_id+' tr').length;
        var newrow = $('<tr></tr>').addClass('datarow item-'+id);
        newrow.append($('<td></td>'));
        newrow.append($('<td></td>').addClass('center').text(includedSMS));
        newrow.append($('<td></td>').addClass('center').text(price));
        var checkbox = $('<span></span>').addClass('custom-checkbox').html('<input type="checkbox" class="checkbox-'+id+'" name="checkbox"><span class="box"><span class="tick"></span></span>');
        checkbox.find('input').on('change',function(){
                if($(this).attr('checked') == 'checked') {
                        $(this).closest('tr').addClass("selected");
                }
                else{
                        $(this).closest('tr').removeClass("selected");
                }
                update_footer($(this).closest('.table-box').attr('id'));
        });
        newrow.append($('<td></td>').addClass('tcheck').append(checkbox));
        newrow.append($('<td></td>'));

        $('#'+div_id).find('table tbody').append(newrow);
        billingModelModified = true;
}

// clear red border on text inputs on focus
$('input[type=text]').on('focus',function(){
	if($(this).hasClass('input-notvalid')){
		$(this).removeClass('input-notvalid');
	}
});

// function to handle custom tier edit
var edit_tier = function(e){
	var field = $(this);
	var val = field.text();
	var from = field.parent().find('td:nth-child(2)').text();
	var nextFrom = field.parent().next().find('td:nth-child(2)');
	var nextTo = field.parent().next().find('td:nth-child(3)').text();
	var input = $('<input type="text"></input>');
	input.css('width','40px');
	input.val(val);
	field.html('').unbind().append(input);
	input.focus();
	input.on('blur', function(){
		var val = $(this).val();
		error = false;
		if(field.hasClass('tier-price') && (!/^(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(val) || val=='')){
			$(this).addClass('input-notvalid');
			error = true;
		}
		else{
			val = Number(val).toFixed(2);
		}
		if(field.hasClass('tier-to') && (!/^\d+$/.test(val) || parseInt(val) <= parseInt(from) || parseInt(val) >= parseInt(nextTo))){	
			$(this).addClass('input-notvalid');
                        error = true;
		}
		if(!error){
			if(field.hasClass('tier-to')){
				nextFrom.text(val);
			}
			field.html('').text(val);
			updateTierUI();
			setTimeout(function(){
				field.on('click', edit_tier);
			},300);
		}
	});
}

// bind custom tier items editable
$('table.custom-tier tbody tr').each(function(){
	$(this).find('td:nth-child(3)').on('click', edit_tier);
	$(this).find('td:nth-child(4)').on('click', edit_tier);
});

// on adding a new custom tier
$('#tier-add').on('click', function(){
	var from = $(this).parent().parent().prev().find('input:nth-child(1)').removeClass('input-notvalid').val();
	var to = $(this).parent().parent().prev().find('input:nth-child(2)').removeClass('input-notvalid').val();
	var price = Number($(this).parent().parent().prev().find('input:nth-child(3)').removeClass('input-notvalid').val());
	var error = false;
	if( !/^\d+$/.test(to) || parseInt(to) <= parseInt(from)) {
		$(this).parent().parent().prev().find('input:nth-child(2)').addClass('input-notvalid');
		error = true;
	}
	if( !/^(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(price) || price=='') {
		$(this).parent().parent().prev().find('input:nth-child(3)').addClass('input-notvalid');
		error = true;
	}

    if(price < 0.04 || price > 0.3) {
        $(this).parent().parent().prev().find('input:nth-child(2)').addClass('input-notvalid');
        $(this).parent().parent().prev().find('.validate-info').find('div').text('The price per SMS must be greater than $0.04 and less than $0.3');
        $(this).parent().parent().prev().find('.validate-info').css('display','inline-block');
        error = true;
    }

	if(!error){
		var id=$('#table-2 tr').length;
		var newrow = $('<tr></tr>').addClass('datarow item-'+id);
		newrow.append($('<td></td>'));
		newrow.append($('<td></td>').addClass('center').addClass('tier-from').text(from));
		newrow.append($('<td></td>').addClass('center').addClass('tier-to').text(to));
		newrow.append($('<td></td>').addClass('center').addClass('tier-price').text(price));
		newrow.find('td.center').each(function(){
			if(!$(this).hasClass('tier-from')){
				$(this).on('click', edit_tier);
			}
		});
		var checkbox = $('<span></span>').addClass('custom-checkbox').html('<input type="checkbox" class="checkbox-'+id+'" name="checkbox"><span class="box"><span class="tick"></span></span>');;
		checkbox.find('input').on('change',function(){
			if($(this).attr('checked') == 'checked') {
				$(this).closest('tr').addClass("selected");
			}
			else{
				$(this).closest('tr').removeClass("selected");
			}
			update_footer($(this).closest('.table-box').attr('id'));
		});
		newrow.append($('<td></td>').addClass('tcheck').append(checkbox));
		newrow.append($('<td></td>'));
		
		$('#table-2').find('table tbody').append(newrow);
		updateTierUI();
		
		billingModelModified = true;
	}
});

$('#custom_packagemessagetype').on('change',function(){
	switch($(this).val()){
		case '1':
			$(this).parent().parent().find('td:nth-child(3)').find('input').removeAttr('disabled').val('0');
			$(this).parent().parent().find('td:nth-child(4)').find('input').attr('disabled','true').val('');
			break;
		case '2':
			$(this).parent().parent().find('td:nth-child(3)').find('input').attr('disabled','true').val('');
			$(this).parent().parent().find('td:nth-child(4)').find('input').removeAttr('disabled').val('0');
			break;
		case '3':
			$(this).parent().parent().find('td:nth-child(3)').find('input').removeAttr('disabled').val('0');
			$(this).parent().parent().find('td:nth-child(4)').find('input').removeAttr('disabled').val('0');
		break;
	}
});

$('#custom_packagemessagetype').trigger('change');

$('.select-all-visible').on('click',function(){
	$(this).closest("div.table-box").find('input:checkbox').each(function(){
		this.checked = "checked";
		$(this).closest('tr').addClass('selected');
		update_footer($(this).closest('.table-box').attr('id'));
	});
});

$('.uncheck-all-visible').on('click',function(){
	$(this).closest("div.table-box").find('input:checkbox').each(function(){
		this.checked = "";
		$(this).closest('tr').removeClass('selected');
		update_footer($(this).closest('.table-box').attr('id'));
	});
});

$('#package-delete-selected, #reseller-package-delete-selected').on('click',function(){
	$(this).closest("div.table-box").find('input:checkbox').filter(':checked').each(function(){
		$(this).closest('tr').remove();
	});
	update_footer($(this).closest('.table-box').attr('id'));
	billingModelModified = true;
	resellerBillingModelModified = true;
});

$('#tier-delete-selected').on('click',function(){
	var valid = true;
	$(this).closest("div.table-box").find('input:checkbox').filter(':checked').each(function(){
		var next = $(this).parent().parent().parent().next();
		if(next.length > 0){
			if(!next.hasClass('selected')){
				valid = false;
				next.effect("highlight", {color: '#b41e22'}, 1000);
			}
		}
	});
	if(valid){
		$(this).closest("div.table-box").find('input:checkbox').filter(':checked').each(function(){
			$(this).closest('tr').remove();
		});
		update_footer($(this).closest('.table-box').attr('id'));
		updateTierUI();
		billingModelModified = true;
	}
});

function updateTierUI(){
	var to = $('#table-2').find('table tbody tr:last').find('td:nth-child(3)').text();
	if(to == '') to = 0;
	$('#ui-tier-add').find('input:nth-child(1)').val(to);
}

updateTierUI();
$('#account_paymentmodel').trigger('change');




$('.btn.btn-small.btn-danger#delete_account').click(function(){
	var alt_message;
	if(delete_account_children > 0)
	{
		alt_message = "Deleting account '"+delete_account_name+"' will also delete all of the "+delete_account_children+" sub-accounts that this account has.";
	}
	else
	{
		alt_message = "You are about to delete the account '"+delete_account_name+"'. ";
	}

	$('#confirmdelete .modal-body').html(alt_message);
	$('#what_submit').val('delete accounts');
  	$('#confirmdelete').modal();
});

$('#suspend_account').click(function(){
	var alt_message;
	if(delete_account_children > 0)
	{
		alt_message = "This account has "+delete_account_children+" Subaccounts and they will all be suspended if you suspend this account";
	}
	else
	{
		alt_message = "You are about to suspend the account '"+delete_account_name+"'. ";
	}
	$('#confirmsuspend .modal-body').html(alt_message);
	$('#confirmsuspend').modal();
});

$('#cancel_delete').click(function(){
  $('#confirmdelete').modal('hide');
});

$('#accept_delete').click(function(){
	$.ajax({
		type: 'POST',
		url: delete_account_url,
		data: {
			'what_submit': $('#what_submit').val(),
			'accounts': delete_accounts
		},
		success:function(data) {
			delete_accounts = new Array();
			//refresh this page
			window.location.assign(delete_redirect_url);
		}
	});
});

$('#cancel').click(function(){
	window.location.assign(delete_redirect_url); 
});

$('.custom-checkbox').find('input').on('change',function(){
	$(this).closest('tr').toggleClass("selected");
	update_footer($(this).closest('.table-box').attr('id'));
});

$(function() {
$('.ui-selectmenu-status').css({'font-weight': 'normal', 'font-size':'12px', 'color':'#666666'});
$('#s2id_account_parent span').css({'font-weight': 'normal','font-size':'12px','color':'#666666'});
});

$('#reseller_default_billing_model').on('change', function(){
	resellerBillingModelModified = true;

});


function dataFormatSelection(data) {
    return data.name;
}


function dataFormatResult(data) {
    var markup = "<table class='movie-result'><tr>";
   
    markup += "<td class='data-info'><div class='data-title'>" + data.name + "</div>";
 
    markup += "</td></tr></table>"
    return markup;
}


$(function(){
	select_countries();
});

//format dropdown
function dataFormatResult(data) {
	
   
    var markup = "<table class='movie-result'><tr>";
   
    markup += "<td class='data-info'><div class='data-title'>" + data.name + "</div>";
 
    markup += "</td></tr></table>"
    return markup;
}

//format dropdown selection
function dataFormatSelection(data) {

    return data.name;
}

function select_countries()
{
			//AJAX for super user search on assign to account dialog
		    $('#assign_countries').select2({
		        initSelection: function(element, callback) {
					
		            return $.ajax({
		                url: g_all_countries_url,
		                dataType: 'json',
		                data: {ids: element.val() },
		                success: function(data){
		                    callback(data.items);
		                }
		            });
		        },
		    	multiple:true,
		    	ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
		    		url: g_all_countries_url,
		    		data: function (term, page) {
		    			return {
		    				search: term, // search term
		    				limit: 10,
		    				page: page
		    			};
		    		},
		    		results: function (data, page) { // parse the results into the format expected by Select2.
		    			// since we are using custom formatting functions we do not need to alter remote JSON data
		    
		    			data =  jQuery.parseJSON(data);
		    			
						var arr=[];
							arr = $.merge(arr,$('#assign_countries').select2('val'));
						
						data.items = $.grep(data.items, function(val) {
							if($.inArray(val.id, arr) == -1) 
							{
								return true;
							}
							else
							{
								return false;
							}
						});						
						
				        var more = (page * 10) < data.total;

		    			return {results: data.items, more: more};
		    		}
		    	},
		    	formatResult: dataFormatResult, // omitted for brevity, see the source of this page
		    	formatSelection: dataFormatSelection, // omitted for brevity, see the source of this page
		    	dropdownCssClass: "bigdrop" // apply css that makes the dropdown taller
		    });
		    
		    
}


//show the footer or hide the footer on the table
function table_footer_showhide(parent){
	count_checked_numbers = parent.find('table .custom-checkbox input[type="checkbox"]:checked').length;
    if (count_checked_numbers > 0){
        parent.find('.table-footer-2').show();
        parent.find('.table-footer-1').hide();

        parent.find('table .custom-checkbox input[type="checkbox"]:checked').each(function(){
        	$(this).parent().parent().parent().addClass('selected');
        })
    }else{
        parent.find('.table-footer-1').show();
        parent.find('.table-footer-2').hide();
    }
}



function create_table_result(data,parent){

	html = '';
	htmlhead = '';
	
	//generate table head
	htmlhead += '<tr>';
	htmlhead += '<th colspan="1" class="first"><a href="'+data.base_url+'/name/'+data.sort_by_name+'/'+data.limit+'/'+data.offset+'">Country Name</a></th>';
	htmlhead += '<th colspan="1"></th>';
	htmlhead += '<th class="last" colspan="1"></th>';
	htmlhead += '</tr>';
	parent.find('#country-table-1.countrylist table thead').html(htmlhead);
	parent.find('#country-table-1.countrylist table thead a').click(function(e){
		resend_url(this.href, parent);
		e.preventDefault();
	});

	//generate html select page
	htmlselectpage = '';
	htmlselectpage += '';
	
	pages = [5,10,20,50,100];
	$.each(pages, function(index,value){
		add_selected = '';
		if (data.limit == value)
			add_selected = ' selected="selected" ';
		htmlselectpage += '<option '+add_selected+' value="'+data.base_url+'/'+data.sort_by+'/'+data.sort_order+'/'+value+'">'+value+' / page</option>';
	});
	//destroy the select2 so we can re-initialize it again
	parent.find('select.selectpage_country').selectmenu('destroy');
	parent.find('select.selectpage_country').select2('destroy');

	//add html
	parent.find('#country-table-1.countrylist .selectpage ul select').html(htmlselectpage);
	parent.find('select.selectpage_country').select2();

	//checkboxes
	add_checked = '';
	if (data.countries != undefined){
		c = 1;
		$.each(data.countries, function(index, country) {
		
		
			html += '<tr class="item-'+c+' item">';
			html += '<td>'+country.name+'</td>';
			
			add_checked = '';
			$.each(data.selected_countries, function(index, selected_country) {
				if (country.id == selected_country){
					add_checked = ' checked="checked" ';
					return;
				}
			});
			
			html += '<td><span class="custom-checkbox"><input type="checkbox" '+add_checked+' class="checkbox-'+c+'" value="'+country.id+'"><span class="box"><span class="tick"></span></span></span></td><td class="last"></td>';
			html += '</tr>';
			
			c++;
		
		});
	}
	
	parent.find('#country-table-1.countrylist table tbody').html(html);

	//generate pagination
	parent.find('#country-table-1.countrylist .pager .pagination').html(data.pagination);

	offset_desc = parseInt(data.offset) + 1;
	limit_desc = parseInt(data.limit) + parseInt(data.offset);
	showing_results_txt = 'Showing results '+offset_desc+' - '+limit_desc+' of '+data.total_count;
	parent.find('#country-table-1.countrylist .footer .showresult').html(showing_results_txt);

	//reload url on select page change
	parent.find('select.selectpage_country').unbind('change');
	parent.find('select.selectpage_country').change(function(e){
		resend_url(parent.find('select.selectpage_country').val(),parent);
		e.preventDefault();
	});

	//reload url on pagination click
	parent.find('#country-table-1.countrylist .pager .pagination a').unbind('click');
	parent.find('#country-table-1.countrylist .pager .pagination a').click(function(e){
		resend_url(this.href,parent);
		e.preventDefault();
	});


//	$.getScript("/javascripts/table.js", function(data, textStatus, jqxhr) {
		//checkbox click handler
		parent.find('#country-table-1.countrylist table .custom-checkbox input[type="checkbox"]').unbind('click');
		parent.find('#country-table-1.countrylist table .custom-checkbox input[type="checkbox"]').on('click', function() {
			table_footer_showhide(parent.find('#country-table-1.countrylist'));
			
			if ($(this).is(":checked")){
			
				var view_all_selected_countries =  parent.find('input.assign_countries').select2('val');	
				view_all_selected_countries.push($(this).val());
				
				//get the current value of 	
				parent.find('input.assign_countries').select2('val', view_all_selected_countries);
			
			}else{
				var removeItem = $(this).val();
				var view_all_selected_countries = $.grep(parent.find('input.assign_countries').select2('val'), function(value) {
  					return value != removeItem;
				});

				parent.find('input.assign_countries').select2('val',view_all_selected_countries);
			}
		});

		//select-all click handler
		parent.find("#country-table-1.countrylist .table-footer .select-all").unbind('click');
		parent.find("#country-table-1.countrylist .table-footer .select-all").click(function() {

			var view_all_selected_countries = []		
			parent.find('#country-table-1.countrylist table .custom-checkbox input[type="checkbox"]').each(function(index, value){
				view_all_selected_countries.push(value.value);
			});

			//merge
			view_all_selected_countries = $.merge(parent.find('input.assign_countries').select2('val'), view_all_selected_countries);

			parent.find('input.assign_countries').select2('val', view_all_selected_countries);			
			
			
		});

		//uncheck-all click handler
		parent.find("#country-table-1.countrylist .table-footer .uncheck-all").unbind('click');
		parent.find("#country-table-1.countrylist .table-footer .uncheck-all").click(function() {

			var view_all_selected_countries = parent.find('input.assign_countries').select2('val');
			
			parent.find('#country-table-1.countrylist table .custom-checkbox input[type="checkbox"]').each(function(index, value){
				removeItem = value.value;
				
				view_all_selected_countries = $.grep(view_all_selected_countries, function(value) {
  					return value != removeItem;
				});
			});

			parent.find('input.assign_countries').select2('val', view_all_selected_countries);		


		});
 //   });

    table_footer_showhide(parent.find('#country-table-1.countrylist'));
}


//resend url function reload page via ajax
function resend_url(url,parent){
		var default_countries = parent.find('input.assign_countries').select2("val");	
	$.ajax({
		type : "POST",
		url  : url,
		data:{ 
			"country_ids":default_countries,
            "ajax_mode" : '1',
            'resend' :'1'
		},
		success:function(data) {      
	    	data = JSON.parse(data);       
	    	create_table_result(data,parent);
		}
	});
}



$(function(){



	//footer show hide on each panel

	table_footer_showhide($('#country-table-1.countrylist'));

	//view all scripts
	$('.show-table.view-all-list').live('click', function(e){

		var anchor =$(this); 

		//get the d of the account
		var default_countries = anchor.parents('#internationalbilling_div_id').find('input.assign_countries').select2("val").toString();	
	
		$.ajax({
			type: "POST",
			url: g_view_all_countries_url,
			data:{ 
                "country_ids": default_countries,
                "ajax_mode" : '1'
            },
            success:function(data) {     
            	data = JSON.parse(data);       
            	create_table_result(data, anchor.parents('#internationalbilling_div_id'));
			}
		});

		e.preventDefault();
	});


	//reinit show-table show-select
  $('form.form-type1 .show-table').die('click');
  $('form.form-type1 .show-select').die('click');

  $('form.form-type1 .show-table').live('click', function() { 
  	
    $(this).parents('#internationalbilling_div_id').find('.show-table').addClass('hide')
    $(this).parents('#internationalbilling_div_id').find('.multiple-select').addClass('hide')
    $(this).parents('#internationalbilling_div_id').find('.show-select').removeClass('hide')
    $(this).parents('#internationalbilling_div_id').find('#country-table-1').removeClass('hide')
    return false;
  });

  $('form.form-type1 .show-select').live('click', function() { 
    $(this).parents('#internationalbilling_div_id').find('.show-select').addClass('hide')
    $(this).parents('#internationalbilling_div_id').find('#country-table-1').addClass('hide')
    $(this).parents('#internationalbilling_div_id').find('.multiple-select').removeClass('hide')
    $(this).parents('#internationalbilling_div_id').find('.show-table').removeClass('hide')
    return false;
  });


	//reinit select-all 	
  $(".select-all").die("click");
  $(".select-all").live("click", function() {
	var container =  $(this).parents('div.table-box');
      container.find("input:checkbox").each(function() {
      this.checked = "checked";
      var checkboxID = $(this).attr('class').substr(9,3);
      var trashID =  'td.trash-' + checkboxID
      var trID =   'tr.item-' + checkboxID

      if($(this).attr('checked') == 'checked') {
        container.find(trashID).addClass('showicons')
        container.find(trID).addClass('selected')
        container.find('.table-footer-1').css('display','none')
        container.find('.table-footer-2').css('display','block')
      } else {
        container.find(trashID).removeClass('showicons')
        container.find(trID).removeClass('selected')
        container.find('.table-footer-1').css('display','block')
        container.find('.table-footer-2').css('display','none')
      }
		$(this).trigger('change');
    });
  });

	//reinit uncheck-all
  $(".uncheck-all").die("click");
  $(".uncheck-all").live("click", function() {
	var container =  $(this).parents('div.table-box');
      container.find("input:checkbox").each(function() {
      $(this).removeAttr('checked');
      var checkboxID = $(this).attr('class').substr(9,3);
      var trashID = 'td.trash-' + checkboxID
      var trID = 'tr.item-' + checkboxID

      container.find(trashID).removeClass('showicons')
      container.find(trID).removeClass('selected')
      container.find('.table-footer-1').css('display','block')
      container.find('.table-footer-2').css('display','none')
		$(this).trigger('change');
    });
  });


});
