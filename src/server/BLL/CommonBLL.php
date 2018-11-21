<?php 
    class CommonBLL
    {
        public function GetDepartamentos()
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetDepartamentos();
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }

        public function GetInstituciones()
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetInstituciones();
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }

        public function GetProgramas()
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetProgramas();
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }

        public function GetMunicipios()
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetMunicipios();
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }
    }
?>