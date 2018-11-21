<?php 
    class CommonDAL
    {
        public function GetDepartamentos()
        {
            $responseDTO = new ResponseDTO();
            
            try 
            {
                $dataBaseServicesBLL = new DataBaseServicesBLL();
                $responseDTO = $dataBaseServicesBLL->InitializeDataBaseConnection();
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                $query = "SELECT * FROM \"UAMSNIES\".cmn_depto";
                $responseDTO = $dataBaseServicesBLL->ExecuteQuery($query);
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                //Recuperar los registros de la BD
                $result = $dataBaseServicesBLL->Q->fetchAll();	
                
                if($result == null)
                {
                    $responseDTO->UIMessage = "No hay items para mostrar";
                    return $responseDTO;
                }

                $itemsList = array();
                while ($row = array_shift($result)) 
                {
                    $departamentoDTO = new DepartamentoDTO();
                    $departamentoDTO->Codigo = $row['depto_codigo'];
                    $departamentoDTO->Nombre = $row['depto_nombre'];
                    
                    array_push($itemsList, $departamentoDTO);
                }

                if($itemsList == null)
                {
                    $responseDTO->UIMessage = "No se encontraron registros para mostrar";
                    return $responseDTO;
                } 
                
                $responseDTO->ResultData = $itemsList;

                $dataBaseServicesBLL->connection = null;
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
                $dataBaseServicesBLL = new DataBaseServicesBLL();
                $responseDTO = $dataBaseServicesBLL->InitializeDataBaseConnection();
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                $query = "SELECT * FROM \"UAMSNIES\".cmn_institucion";
                $responseDTO = $dataBaseServicesBLL->ExecuteQuery($query);
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                //Recuperar los registros de la BD
                $result = $dataBaseServicesBLL->Q->fetchAll();	
                
                if($result == null)
                {
                    $responseDTO->UIMessage = "No hay items para mostrar";
                    return $responseDTO;
                }

                $itemsList = array();
                while ($row = array_shift($result)) 
                {
                    $institucionDTO = new InstitucionDTO();
                    $institucionDTO->Codigo = $row['ins_codigo'];
                    $institucionDTO->CodigoPadre = $row['ins_codigo_padre'];
                    $institucionDTO->Nombre = $row['ins_nombre'];
                    
                    array_push($itemsList, $institucionDTO);
                }

                if($itemsList == null)
                {
                    $responseDTO->UIMessage = "No se encontraron registros para mostrar";
                    return $responseDTO;
                } 
                
                $responseDTO->ResultData = $itemsList;

                $dataBaseServicesBLL->connection = null;
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
                $dataBaseServicesBLL = new DataBaseServicesBLL();
                $responseDTO = $dataBaseServicesBLL->InitializeDataBaseConnection();
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                $query = "SELECT * FROM \"UAMSNIES\".cmn_programa";
                $responseDTO = $dataBaseServicesBLL->ExecuteQuery($query);
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                //Recuperar los registros de la BD
                $result = $dataBaseServicesBLL->Q->fetchAll();	
                
                if($result == null)
                {
                    $responseDTO->UIMessage = "No hay items para mostrar";
                    return $responseDTO;
                }

                $itemsList = array();
                while ($row = array_shift($result)) 
                {
                    $programaDTO = new ProgramaDTO();
                    $programaDTO->Codigo = $row['prog_codigo'];
                    $programaDTO->Nombre = $row['prog_nombre'];
                    
                    array_push($itemsList, $programaDTO);
                }

                if($itemsList == null)
                {
                    $responseDTO->UIMessage = "No se encontraron registros para mostrar";
                    return $responseDTO;
                } 
                
                $responseDTO->ResultData = $itemsList;

                $dataBaseServicesBLL->connection = null;
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
                $dataBaseServicesBLL = new DataBaseServicesBLL();
                $responseDTO = $dataBaseServicesBLL->InitializeDataBaseConnection();
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                $query = "SELECT * FROM \"UAMSNIES\".cmn_municipio";
                $responseDTO = $dataBaseServicesBLL->ExecuteQuery($query);
                if($responseDTO->HasErrors)
                {
                    return $responseDTO;
                }

                //Recuperar los registros de la BD
                $result = $dataBaseServicesBLL->Q->fetchAll();	
                
                if($result == null)
                {
                    $responseDTO->UIMessage = "No hay items para mostrar";
                    return $responseDTO;
                }

                $itemsList = array();
                while ($row = array_shift($result)) 
                {
                    $municipioDTO = new MunicipioDTO();
                    $municipioDTO->Codigo = $row['mun_codigo'];
                    $municipioDTO->CodigoDepartamento = $row['depto_codigo'];
                    $municipioDTO->Nombre = $row['mun_nombre'];
                    
                    array_push($itemsList, $municipioDTO);
                }

                if($itemsList == null)
                {
                    $responseDTO->UIMessage = "No se encontraron registros para mostrar";
                    return $responseDTO;
                } 
                
                $responseDTO->ResultData = $itemsList;

                $dataBaseServicesBLL->connection = null;
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }

            return $responseDTO;
        }
    }
?>