

if(window.location.hash)
{
	var hash_value = window.location.hash.replace('#', '');

	if(hash_value == 'confirm')
	{
		$(function(){
			document.getElementById('confirm3').setAttribute("class", "alert alert-success show");
		});
	}

	if(hash_value == 'error')
	{
		$(function(){
			document.getElementById('confirm4').setAttribute("class", "alert alert-error show");
		});
	}
}

function trashon(id)
{
	document.getElementById("t-"+id).setAttribute("class", "trash trash-"+id+" showicons");
}

function trashoff(id)
{
	var cb = document.getElementById("checkbox-"+id);

	if(cb.checked)
	{
		document.getElementById("t-"+id).setAttribute("class", "trash trash-"+id+" showicons");
	}
	else
	{
		document.getElementById("t-"+id).setAttribute("class", "trash trash-"+id);
	}
}

function setascheck(id)
{
	document.getElementById('useronly').value = id;
}

function toggle(id, uu)
{
	var cb = document.getElementById("checkbox-"+id);

	if(cb.checked)
	{
		document.getElementById("item-"+id).setAttribute("class", "item-"+id+" item selected");
		$(function(){
			var c = $("input:checkbox:checked").length;

			if(c == 1)
			{
				var s = $("input:checkbox:checked").val();
				var b = '#cb-'+s;
				var t = $(b).text();

				document.getElementById('uu').innerHTML = t;
				document.getElementById('useronly1').value = t;
			}
		});
	}
	else
	{
		document.getElementById("item-"+id).setAttribute("class", "item-"+id+" item");
		$(function(){
			var c = $("input:checkbox:checked").length;

			if(c == 1)
			{
				var s = $("input:checkbox:checked").val();
				var b = '#cb-'+s;
				var t = $(b).text();

				document.getElementById('uu').innerHTML = t;
				document.getElementById('useronly1').value = t;
			}
		});
	}
}

function feeduser(uu)
{
	document.getElementById('uu').innerHTML = uu;
	document.getElementById('useronly1').value = uu;
	document.getElementById('aswhat').value = 'delete';
}

$(function(){
	/*
	$('#delete-selected').click(function(){
		$('#confirm2').modal();
	});
	*/

	$('#delete-selected').click(function(){
		var o;
		if(document.getElementById("imadmin").checked == true)
		{
			o = 1;
		}
		else
		{
			o = 0;
		}

		var c = $("input:checkbox:checked").length;

		c = c - o;

		if(c == 1)
		{
			var s = $("input:checkbox:checked").val();
			var b = '#cb-'+s;
			var t = $(b).text();
			document.getElementById('uu').innerHTML = t;
			document.getElementById('useronly1').value = t;
			document.getElementById('aswhat').value = 'delete';
			$('#confirm1').modal();
		}
		else
		{
			document.getElementById('aswhat').value = 'delete';
			document.getElementById('nn').innerHTML = c;
			$('#confirm2').modal();
		}
	});

	$('#primary-selected').click(function(){
		var c = $("input:checkbox:checked").length;

		if(c == 1)
		{
			var s = $("input:checkbox:checked").val();
			var b = '#cb-'+s;
			var t = $(b).text();
			document.getElementById('uup').innerHTML = t;
			document.getElementById('useronly1').value = t;
			document.getElementById('aswhat').value = 'primary';
			$('#asprimary').modal();
		}
		else
		{
			document.getElementById('aswhat').value = 'primary';
			/*document.getElementById('nnp').innerHTML = c;*/
			$('#asprimaryn').modal();
		}
	});

	$('#billing-selected').click(function(){
		var c = $("input:checkbox:checked").length;

		if(c == 1)
		{
			var s = $("input:checkbox:checked").val();
			var b = '#cb-'+s;
			var t = $(b).text();
			document.getElementById('uub').innerHTML = t;
			document.getElementById('useronly1').value = t;
			document.getElementById('aswhat').value = 'billing';
			$('#asbilling').modal();
		}
		else
		{
			document.getElementById('aswhat').value = 'billing';
			document.getElementById('nnb').innerHTML = c;
			$('#asbillingn').modal();
		}
	});

	$('#technical-selected').click(function(){
		var c = $("input:checkbox:checked").length;

		if(c == 1)
		{
			var s = $("input:checkbox:checked").val();
			var b = '#cb-'+s;
			var t = $(b).text();
			document.getElementById('uut').innerHTML = t;
			document.getElementById('useronly1').value = t;
			document.getElementById('aswhat').value = 'technical';
			$('#astechnical').modal();
		}
		else
		{
			document.getElementById('aswhat').value = 'technical';
			document.getElementById('nnt').innerHTML = c;
			$('#astechnicaln').modal();
		}
	});

	$('.icon-trash').click(function(){
		$('#confirm1').modal();
	});

	$('#cancel1').click(function(){
		/*$('#confirm1').css({ 'display': 'none' });*/
		$('#confirm1').modal('hide');
	});

	$('#close1').click(function(){
		/*$('#confirm1').css({ 'display': 'none' });*/
		$('#confirm1').modal('hide');
	});

	$('#cancel2').click(function(){
		/*$('#confirm2').css({ 'display': 'none' });*/
		$('#confirm2').modal('hide');
	});

	$('#cancel3').click(function(){
		/*$('#confirm2').css({ 'display': 'none' });*/
		$('#confirm3').modal('hide');
	});

	$('#cancel4').click(function(){
		/*$('#confirm2').css({ 'display': 'none' });*/
		$('#confirm4').modal('hide');
	});

	$('#close2').click(function(){
		/*$('#confirm2').css({ 'display': 'none' });*/
		$('#confirm2').modal('hide');
	});

	$('#close3').click(function(){
		/*$('#confirm2').css({ 'display': 'none' });*/
		$('#confirm3').modal('hide');
	});

	$('#close4').click(function(){
		/*$('#confirm2').css({ 'display': 'none' });*/
		$('#confirm4').modal('hide');
	});

	$('#accept1').click(function(){
		$("form#foform").submit();
	});

	$('#accept2').click(function(){
		$("form#foform").submit();
	});

	$('#accept3').click(function(){
		$('#confirm3').modal('hide');
	});

	$('#accept4').click(function(){
		$('#confirm4').modal('hide');
	});

	$('#submitprimary').click(function(){
		$("form#foform").submit();
	});

	$('#submitbilling').click(function(){
		$("form#foform").submit();
	});

	$('#submittechnical').click(function(){
		$("form#foform").submit();
	});

	$('#submitprimaryn').click(function(){
		$("#asprimaryn").modal('hide');
	});

	$('#submitbillingn').click(function(){
		$("form#foform").submit();
	});

	$('#submittechnicaln').click(function(){
		$("form#foform").submit();
	});

	$('#cancelprimary').click(function(){
		/*$('#confirm2').css({ 'display': 'none' });*/
		$('#asprimary').modal('hide');
	});

	$('#cancelprimaryn').click(function(){
		/*$('#confirm2').css({ 'display': 'none' });*/
		$('#asprimaryn').modal('hide');
	});

	$('#cancelbilling').click(function(){
		/*$('#confirm2').css({ 'display': 'none' });*/
		$('#asbilling').modal('hide');
	});

	$('#cancelbillingn').click(function(){
		/*$('#confirm2').css({ 'display': 'none' });*/
		$('#asbillingn').modal('hide');
	});

	$('#canceltechnical').click(function(){
		/*$('#confirm2').css({ 'display': 'none' });*/
		$('#astechnical').modal('hide');
	});

	$('#canceltechnicaln').click(function(){
		/*$('#confirm2').css({ 'display': 'none' });*/
		$('#astechnicaln').modal('hide');
	});
});
