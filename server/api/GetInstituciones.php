<?php 
    include_once("../Libraries/commonLibraries.php");

    $responseDTO = new ResponseDTO();
	
	try 
	{
        $commonBLL = new CommonBLL();
        $responseDTO = $commonBLL->GetInstituciones();
	} 
	catch (Throwable $e) 
	{
		$responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
	}
    
	echo json_encode($responseDTO);
?>